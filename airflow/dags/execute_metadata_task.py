from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from airflow.utils.log.logging_mixin import LoggingMixin
from web3 import Web3
from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql
import os
import requests

# Importing functions from other modules
from helpers.dbCalls import (
    get_contracts_from_staging,
    insert_token_to_db,
    get_token_ids,
    update_token_ids,
    get_collection_id,
    insert_collection_to_db,
    insert_publisher_to_db,
    nft_exists,
    insert_nft_to_db,
    update_metadata_status,
    get_publisher_id,
    insert_into_verification_table,
)
from helpers.externalApiCalls import fetch_erc20, fetch_contract_metadata
from helpers.nodeCalls import fetch_token_metadata, token_id_finder

# Load environment variables
load_dotenv(dotenv_path='.env')

# Define the connection parameters
ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")
DATABASE_URL = os.getenv("POSTGRES_URL")

# Setting up the DAG
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
}

dag = DAG(
    'execute_metadata',
    default_args=default_args,
    description='A DAG to process and insert metadata to transform from staging',
    schedule_interval='0 2 * * *',
    start_date=days_ago(1),
    catchup=False,
)

# Set up logging
log = LoggingMixin().log

def process_contract(contract_address, publisher_name, token_type):
    conn = None
    cursor = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        contract_address = Web3.to_checksum_address(contract_address)
        if token_type == 'ERC20':
            token_data = fetch_erc20(contract_address)
            if token_data:
                insert_token_to_db(token_data, contract_address)
                log.info("Token data inserted into DB.")
                update_metadata_status(contract_address, True)
                insert_into_verification_table(contract_address, token_type)
                return
            else:
                log.error(f"Failed to fetch ERC-20 token data for contract address {contract_address}. Aborting.")
                update_metadata_status(contract_address, False)
                return

        log.info("Not an ERC-20 token. Proceeding to fetch contract metadata.")
        metadata_response = fetch_contract_metadata(contract_address)
        if metadata_response:
            existing_token_ids = get_token_ids(contract_address, is_publisher=bool(publisher_name))
            if existing_token_ids:
                log.info(f"Token IDs already exist for contract {metadata_response['name']}")
                token_ids = existing_token_ids
            else:
                token_ids = token_id_finder(contract_address, "ERC-721")
                if token_ids:
                    update_token_ids(contract_address, metadata_response['name'], token_ids, is_publisher=bool(publisher_name))

            publisher_id = None
            collection_id = None
            deployer_address = metadata_response.get('contractDeployer', None)

            if publisher_name:
                publisher_data = {
                    'name': publisher_name,
                    'description': metadata_response.get('openSeaMetadata', {}).get('description', ''),
                    'media_url': metadata_response.get('openSeaMetadata', {}).get('imageUrl', ''),
                    'contract_address': contract_address
                }
                publisher_id = get_publisher_id(contract_address)
                if not publisher_id:
                    publisher_id = insert_publisher_to_db(publisher_data, token_ids)
                else:
                    update_token_ids(contract_address, publisher_name, token_ids, is_publisher=True)

                if not publisher_id:
                    log.error(f"Failed to insert publisher for contract address {contract_address}. Aborting.")
                    update_metadata_status(contract_address, False)
                    return
            else:
                collection_id = get_collection_id(contract_address, metadata_response['name'])
                if not collection_id:
                    collection_id = insert_collection_to_db(metadata_response, token_ids)

            log.info(f"Collection ID: {collection_id}, Publisher ID: {publisher_id}")

            if (publisher_id or collection_id) and token_ids:
                for token_id in token_ids:
                    if nft_exists(contract_address, token_id):
                        log.info(f"NFT with contract address {contract_address} and token ID {token_id} already exists. Skipping fetch.")
                        continue

                    for _ in range(3):  # Retry logic
                        try:
                            response = fetch_token_metadata(contract_address, token_id, "ERC-721")
                            if response:
                                response['contract_address'] = contract_address
                                insert_nft_to_db(response, collection_id, deployer_address, publisher_id)
                                break  # Exit retry loop on success
                        except requests.exceptions.RequestException as e:
                            log.error(f"Request error fetching token metadata: {e}")
                            time.sleep(5)  # Wait before retrying
                        except Exception as e:
                            log.error(f"Error fetching token metadata: {e}")
                            break  # Non-retryable error

                update_metadata_status(contract_address, True)
                insert_into_verification_table(contract_address, token_type)
            else:
                update_metadata_status(contract_address, False)
        else:
            update_metadata_status(contract_address, False)
    except Exception as e:
        log.error(f"Error processing contract address {contract_address}: {e}")
        update_metadata_status(contract_address, False)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def execute_metadata():
    unprocessed_contracts = get_contracts_from_staging()
    if not unprocessed_contracts:
        log.info("No unprocessed contracts found.")
        return

    for contract_address, publisher_name, metadata_added, token_type in unprocessed_contracts:
        if metadata_added:
            log.info(f"Metadata already added for contract address {contract_address}. Skipping.")
            continue

        process_contract(contract_address, publisher_name, token_type)

# Define the PythonOperator
execute_metadata_task = PythonOperator(
    task_id='execute_metadata_task',
    python_callable=execute_metadata,
    dag=dag,
)

# Define the task dependencies (if any)
execute_metadata_task
