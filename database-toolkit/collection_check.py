## collection_check.py
import psycopg2
from psycopg2.extras import DictCursor
from dotenv import load_dotenv
from web3 import Web3
import os

# Load environment variables
load_dotenv(dotenv_path='.env.local')

# Database connection parameters
DB_PARAMS = {
    'dbname': os.getenv('POSTGRES_DATABASE'),
    'user': os.getenv('POSTGRES_USER'),
    'password': os.getenv('POSTGRES_PASSWORD'),
    'host': os.getenv('POSTGRES_HOST')
}

def connect_db():
    """Connect to the PostgreSQL database server."""
    conn = None
    try:
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**DB_PARAMS)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    return conn

def check_nft_collection_consistency(conn):
    """Check if NFTs' collection ID and contract address match with their collections."""
    try:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("""
                SELECT n.nft_id, n.contract_address as nft_contract_address, c.contract_address as collection_contract_address, c.collection_name
                FROM nfts n
                INNER JOIN collections c ON n.collection_id = c.collection_id
            """)
            rows = cur.fetchall()

            discrepancies = []
            for row in rows:
                # Initialize variables to handle potential None values
                nft_contract_address = row['nft_contract_address'] or ''
                collection_contract_address = row['collection_contract_address'] or ''

                # Check if the NFT's contract address matches the collection's contract address
                if nft_contract_address.lower() != collection_contract_address.lower():
                    discrepancies.append({
                        'nft_id': row['nft_id'],
                        'nft_contract_address': nft_contract_address,
                        'collection_contract_address': collection_contract_address,
                        'collection_name': row['collection_name']
                    })

            # Moved the check outside of the loop
            if discrepancies:
                print("Discrepancies found:")
                for discrepancy in discrepancies:
                    print(f"NFT ID {discrepancy['nft_id']}: Contract address mismatch (NFT: {discrepancy['nft_contract_address']}, Collection: {discrepancy['collection_contract_address']} - {discrepancy['collection_name']})")
            else:
                print("No discrepancies found. All NFTs match their collections correctly.")

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def update_addresses_to_checksum(conn, dry_run=True):
    cursor = conn.cursor()
    cursor.execute("SELECT collection_id, collection_name, contract_address FROM collections")

    updates = []
    for collection_id, collection_name, address in cursor.fetchall():
        checksum_address = Web3.to_checksum_address(address)
        if address != checksum_address:  # Only append if a change is needed
            updates.append((checksum_address, collection_id, collection_name, address))

    # Dry run: display the changes without applying them
    if updates:  # Check if there are any updates to make
        print("Dry run: changes to be made")
        for checksum_address, collection_id, collection_name, original_address in updates:
            print(f"Collection ID {collection_id}, Collection Name {collection_name}: {original_address} -> {checksum_address}")
    else:
        print("All addresses are already in checksum format. No changes needed.")

    if dry_run and updates:  # Only prompt user if there are changes to make
        user_input = input("Proceed with updating addresses to checksum format? (yes/no): ")
        if user_input.lower() == 'yes':
            for checksum_address, collection_id, _, _ in updates:
                update_query = """
                    UPDATE collections
                    SET contract_address = %s
                    WHERE collection_id = %s
                """
                cursor.execute(update_query, (checksum_address, collection_id))
            conn.commit()
            print("Addresses have been updated to checksum format.")
        else:
            print("Operation aborted. No changes were made.")
    elif not updates:
        print("No operation needed. Exiting.")

    cursor.close()


def main():
    conn = connect_db()
    if conn is not None:
        check_nft_collection_consistency(conn)
        update_addresses_to_checksum(conn, dry_run=True)
        conn.close()

if __name__ == '__main__':
    main()
