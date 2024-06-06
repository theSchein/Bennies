from db.connection import connect_db
from psycopg2.extras import DictCursor
from .nftCalls import (
    check_duplicates,
    fill_metadata, 
    process_nft_images, 
    verify_checksums
)
from psycopg2 import Error

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
    except (Exception, Error) as error:
        print(f"Error updating verification table: {error}")
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
    except (Exception, Error) as error:
        print(f"Error logging ingestion: {error}")
        conn.rollback()

def verify_data(contract_address, token_type):
    if token_type == 'ERC20':
        print(f"Skipping verification for ERC-20 contract {contract_address}.")
        return

    conn = connect_db()
    if not conn:
        return

    try:
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

        images_processed = process_nft_images(contract_address)
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
        conn.close()

def verify_metadata():
    conn = connect_db()
    if not conn:
        print("Failed to connect to the database.")
        return

    query = "SELECT contract_address, token_type FROM transform.verification WHERE verified = FALSE;"
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            contracts = cursor.fetchall()
            for contract in contracts:
                contract_address = contract[0]
                token_type = contract[1]
                verify_data(contract_address, token_type)
    except (Exception, Error) as error:
        print(f"Error fetching contracts for verification: {error}")
    finally:
        conn.close()

if __name__ == "__main__":
    verify_metadata()
