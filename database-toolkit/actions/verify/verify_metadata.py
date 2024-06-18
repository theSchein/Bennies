from db.connection import connect_db
from psycopg2.extras import DictCursor
from .nftCalls import (
    check_duplicates,
    fill_metadata, 
    process_nft_images, 
    verify_checksums
)
from .tokenCalls import (
    check_token_duplicates,
    fill_token_metadata,
    process_token_logo,
    verify_token_checksums
)
from psycopg2 import Error

def update_verification_status(conn, contract_address, column, status):
    query = f"""
    UPDATE transform.verification
    SET {column} = %s, last_checked = CURRENT_TIMESTAMP
    WHERE contract_address = %s;
    """
    try:
        with conn.cursor() as cursor:
            cursor.execute(query, (status, contract_address))
            conn.commit()
    except (Exception, Error) as error:
        print(f"Error updating verification status for {column}: {error}")
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
    conn = connect_db()  # Ensure the connection is established before any database operations
    if not conn:
        return

    try:
        with conn.cursor(cursor_factory=DictCursor) as cursor:
            cursor.execute("SELECT * FROM transform.verification WHERE contract_address = %s;", (contract_address,))
            verification_status = cursor.fetchone()

        if token_type == 'ERC20':
            if not verification_status['duplicates_checked']:
                duplicates_checked = check_token_duplicates(conn, contract_address)
                if not duplicates_checked:
                    log_ingestion(conn, contract_address, None, "failed", "Duplicates found")
                    update_verification_status(conn, contract_address, 'duplicates_checked', False)
                    return
                update_verification_status(conn, contract_address, 'duplicates_checked', True)

            if not verification_status['checksums_verified']:
                checksums_verified = verify_token_checksums(conn, contract_address)
                if not checksums_verified:
                    log_ingestion(conn, contract_address, None, "failed", "Checksums not verified")
                    update_verification_status(conn, contract_address, 'checksums_verified', False)
                    return
                update_verification_status(conn, contract_address, 'checksums_verified', True)

            if not verification_status['metadata_filled']:
                metadata_filled = fill_token_metadata(conn, contract_address)
                if not metadata_filled:
                    log_ingestion(conn, contract_address, None, "failed", "Metadata not filled")
                    update_verification_status(conn, contract_address, 'metadata_filled', False)
                    return
                update_verification_status(conn, contract_address, 'metadata_filled', True)

            if not verification_status['images_processed']:
                logo_processed = process_token_logo(conn, contract_address)
                if not logo_processed:
                    log_ingestion(conn, contract_address, None, "failed", "Logo not processed")
                    update_verification_status(conn, contract_address, 'images_processed', False)
                    return
                update_verification_status(conn, contract_address, 'images_processed', True)

            update_verification_status(conn, contract_address, 'verified', True)
            log_ingestion(conn, contract_address, None, "success")
        else:
            if not verification_status['duplicates_checked']:
                duplicates_checked = check_duplicates(contract_address)
                if not duplicates_checked:
                    log_ingestion(conn, contract_address, None, "failed", "Duplicates found")
                    update_verification_status(conn, contract_address, 'duplicates_checked', False)
                    return
                update_verification_status(conn, contract_address, 'duplicates_checked', True)

            if not verification_status['metadata_filled']:
                metadata_filled = fill_metadata(contract_address)
                if not metadata_filled:
                    log_ingestion(conn, contract_address, None, "failed", "Metadata not filled")
                    update_verification_status(conn, contract_address, 'metadata_filled', False)
                    return
                update_verification_status(conn, contract_address, 'metadata_filled', True)

            if not verification_status['images_processed']:
                images_processed = process_nft_images(contract_address, threshold=0.9)
                if not images_processed:
                    log_ingestion(conn, contract_address, None, "failed", "Images not processed")
                    update_verification_status(conn, contract_address, 'images_processed', False)
                    return
                update_verification_status(conn, contract_address, 'images_processed', True)

            if not verification_status['checksums_verified']:
                checksums_verified = verify_checksums(contract_address)
                if not checksums_verified:
                    log_ingestion(conn, contract_address, None, "failed", "Checksums not verified")
                    update_verification_status(conn, contract_address, 'checksums_verified', False)
                    return
                update_verification_status(conn, contract_address, 'checksums_verified', True)

            update_verification_status(conn, contract_address, 'verified', True)
            log_ingestion(conn, contract_address, None, "success")
    finally:
        conn.close()  # Ensure the connection is closed after operations

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
