import os
import time
from web3 import Web3
from dotenv import load_dotenv
import psycopg2
from psycopg2 import Error
from utils.externalApiCalls import fetch_erc20, fetch_contract_metadata
from .dbCalls import (
    get_contracts_from_staging, 
    insert_token_to_db, 
    update_metadata_status, 
    insert_into_verification_table,
    mark_as_bad_contract  # New function to mark as bad contract
)

# Load environment variables
load_dotenv(dotenv_path='.env.local')

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")
DATABASE_URL = os.getenv("POSTGRES_URL")

if not ALCHEMY_API_KEY:
    print("Error: ALCHEMY_API_KEY is not set.")
    exit(1)
if not MORALIS_API_KEY:
    print("Error: MORALIS_API_KEY is not set.")
    exit(1)
if not DATABASE_URL:
    print("Error: DATABASE_URL is not set.")
    exit(1)

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
except (Exception, Error) as error:
    print("Error connecting to database:", error)
    exit(1)

def process_token_contract(contract_address, token_type, retry_attempts=3):
    if not conn:
        print("Failed to connect to the database.")
        return

    try:
        contract_address = Web3.to_checksum_address(contract_address)
    except ValueError:
        print(f"Invalid contract address: {contract_address}")
        update_metadata_status(contract_address, False)
        # mark_as_bad_contract(contract_address)
        return

    attempt = 0
    while attempt < retry_attempts:
        try:
            if token_type == 'ERC20':
                print(f"Fetching ERC-20 token data for contract address {contract_address}...")
                token_data = fetch_erc20(contract_address)
                print('contract_address:', contract_address)
                if token_data:
                    insert_token_to_db(token_data, contract_address)
                    print("Token data inserted into DB.")
                    update_metadata_status(contract_address, True)
                    insert_into_verification_table(contract_address, token_type)
                    return
                else:
                    raise ValueError("No data returned from fetch_erc20")

            print("Not an ERC-20 token. Proceeding to fetch contract metadata.")
            metadata_response = fetch_contract_metadata(contract_address)
            if metadata_response:
                # Handle additional metadata processing if necessary
                update_metadata_status(contract_address, True)
                insert_into_verification_table(contract_address, token_type)
                return
            else:
                raise ValueError("No data returned from fetch_contract_metadata")

        except ValueError as ve:
            print(f"Attempt {attempt + 1} failed for contract address {contract_address}: {ve}")
            break  # No need to retry for invalid data errors
        except Exception as e:
            print(f"Attempt {attempt + 1} failed for contract address {contract_address}: {e}")
            if "Unauthorized" in str(e) or "authentication" in str(e):
                print("Authentication issue detected, check your API keys.")
                return
            attempt += 1
            time.sleep(2)  # Exponential backoff could be implemented here

    print(f"Failed to fetch token data for contract address {contract_address} after {retry_attempts} attempts.")
    update_metadata_status(contract_address, False)
    mark_as_bad_contract(contract_address)

def execute_token_metadata():
    unprocessed_contracts = get_contracts_from_staging()
    if not unprocessed_contracts:
        print("No unprocessed contracts found.")
        return

    for contract_address, publisher_name, metadata_added, token_type in unprocessed_contracts:
        if metadata_added:
            print(f"Metadata already added for contract address {contract_address}. Skipping.")
            continue

        process_token_contract(contract_address, token_type)

if __name__ == "__main__":
    execute_token_metadata()
