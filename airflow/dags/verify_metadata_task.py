from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
import logging
from helpers.db.connection import connect_db
from helpers.nftCalls import (
    check_duplicates,
    fill_metadata, 
    process_nft_images, 
    verify_checksums
)
from helpers.tokenCalls import (
    check_token_duplicates,
    fill_token_metadata,
    process_token_logo,
    verify_token_checksums
)
from psycopg2 import Error

# Define default arguments
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
}

# Define the DAG
dag = DAG(
    'verify_metadata_task',
    default_args=default_args,
    description='A DAG to verify metadata for tokens and NFTs',
    schedule_interval='0 4 * * *',
    start_date=days_ago(1),
    catchup=False,
)

def log_message(message):
    logging.info(message)

def update_verification_table(conn, contract_address, duplicates_checked, metadata_filled, images_processed, checksums_verified, verified):
    query = """
    UPDATE transform.verification
    SET duplicates_checked = %s, metadata_filled = %s, images_processed = %s, checksums_verified = %s, verified = %s, last_checked = CURRENT_TIMESTAMP
    WHERE contract_address = %s;
    """
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, (duplicates_checked, metadata_filled, images_processed, checksums_verified, verified, contract_address))
            conn.commit()
        log_message(f"Verification table updated for contract: {contract_address}")
    except (Exception, Error) as error:
        log_message(f"Error updating verification table: {error}")
        conn.rollback()

def log_ingestion(conn, contract_address, token_id, status, error_message=None):
    query = """
    INSERT INTO transform.ingestion_log (contract_address, token_id, status, error_message)
    VALUES (%s, %s, %s, %s);
    """
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, (contract_address, token_id, status, error_message))
            conn.commit()
        log_message(f"Ingestion logged for contract: {contract_address}, token_id: {token_id}, status: {status}")
    except (Exception, Error) as error:
        log_message(f"Error logging ingestion: {error}")
        conn.rollback()

def verify_data(contract_address, token_type):
    conn = connect_db()  # Ensure the connection is established before any database operations
    if not conn:
        log_message("Failed to connect to the database.")
        return

    try:
        if token_type == 'ERC20':
            log_message(f"Verifying ERC20 token: {contract_address}")
            duplicates_checked = check_token_duplicates(conn, contract_address)
            if not duplicates_checked:
                log_ingestion(conn, contract_address, None, "failed", "Duplicates found")
                update_verification_table(conn, contract_address, False, False, False, False, False)
                return

            checksums_verified = verify_token_checksums(conn, contract_address)
            if not checksums_verified:
                log_ingestion(conn, contract_address, None, "failed", "Checksums not verified")
                update_verification_table(conn, contract_address, True, False, False, False, False)
                return

            metadata_filled = fill_token_metadata(conn, contract_address)
            if not metadata_filled:
                log_ingestion(conn, contract_address, None, "failed", "Metadata not filled")
                update_verification_table(conn, contract_address, True, False, False, True, False)
                return

            logo_processed = process_token_logo(conn, contract_address)
            if not logo_processed:
                log_ingestion(conn, contract_address, None, "failed", "Logo not processed")
                update_verification_table(conn, contract_address, True, True, False, True, False)
                return

            update_verification_table(conn, contract_address, True, True, True, True, True)
            log_ingestion(conn, contract_address, None, "success")
        else:
            log_message(f"Verifying NFT collection: {contract_address}")
            duplicates_checked = check_duplicates(contract_address)
            if not duplicates_checked:
                log_ingestion(conn, contract_address, None, "failed", "Duplicates found")
                update_verification_table(conn, contract_address, False, False, False, False, False)
                return

            metadata_filled = fill_metadata(contract_address)
            if not metadata_filled:
                log_ingestion(conn, contract_address, None, "failed", "Metadata not filled")
                update_verification_table(conn, contract_address, True, False, False, False, False)
                return

            images_processed = process_nft_images(contract_address, threshold=0.9)
            if not images_processed:
                log_ingestion(conn, contract_address, None, "failed", "Images not processed")
                update_verification_table(conn, contract_address, True, True, False, False, False)
                return

            checksums_verified = verify_checksums(contract_address)
            if not checksums_verified:
                log_ingestion(conn, contract_address, None, "failed", "Checksums not verified")
                update_verification_table(conn, contract_address, True, True, True, False, False)
                return

            update_verification_table(conn, contract_address, True, True, True, True, True)
            log_ingestion(conn, contract_address, None, "success")
    finally:
        conn.close()  # Ensure the connection is closed after operations

def verify_metadata():
    conn = connect_db()
    if not conn:
        log_message("Failed to connect to the database.")
        return

    query = "SELECT contract_address, token_type FROM transform.verification WHERE verified = FALSE;"
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            contracts = cursor.fetchall()
            for contract in contracts:
                contract_address = contract[0]
                token_type = contract[1]
                log_message(f"Verifying metadata for contract: {contract_address}, type: {token_type}")
                verify_data(contract_address, token_type)
    except (Exception, Error) as error:
        log_message(f"Error fetching contracts for verification: {error}")
    finally:
        conn.close()

# Define the PythonOperators
verify_metadata_task = PythonOperator(
    task_id='verify_metadata',
    python_callable=verify_metadata,
    dag=dag,
)