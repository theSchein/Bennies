from db.connection import connect_db
from web3 import Web3
from web3.exceptions import InvalidAddress

def verify_checksum():
    conn = connect_db()
    if conn is None:
        print("Failed to connect to the database.")
        return

    cursor = conn.cursor()
    try:
        print("Starting dry run to verify checksums...")
        # Dry run to check updates
        perform_updates(cursor, dry_run=True)

        # Ask user if they want to commit changes
        if input("Dry run complete. Commit changes to the database? (yes/no): ").lower() == 'yes':
            print("Committing changes...")
            perform_updates(cursor, dry_run=False)
            conn.commit()
            print("Checksum update process completed successfully.")
        else:
            print("Changes not committed. Exiting.")

    except Exception as e:
        print(f"An error occurred during checksum verification and update: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def perform_updates(cursor, dry_run):
    # Define the tables and fields to update
    tables_info = [
        ('nfts', 'contract_address', 'nft_name'),
        ('collections', 'contract_address', 'collection_name')
    ]
    for table, address_field, name_field in tables_info:
        update_checksums_in_table(cursor, table, address_field, name_field, dry_run)

def update_checksums_in_table(cursor, table, address_field, name_field, dry_run):
    print(f"Verifying checksums in the {table} table.")
    cursor.execute(f"""
        SELECT {address_field}, {name_field}, COUNT(*)
        FROM {table}
        GROUP BY {address_field}, {name_field}
    """)
    addresses = cursor.fetchall()

    updates_needed = 0
    for address, name, count in addresses:
        try:
            new_address = Web3.to_checksum_address(address)
            if address != new_address:
                updates_needed += 1
                print(f"Detected format issue with {name} ({address}). Suggested format: {new_address}")
                if not dry_run:
                    cursor.execute(f"UPDATE {table} SET {address_field} = %s WHERE {address_field} = %s", (new_address, address))
                    print(f"Updated {address} to {new_address}")
                else:
                    print(f"Would update {address} to {new_address}")
        except InvalidAddress:
            print(f"Invalid Ethereum address format detected for {name}: {address}. Address may be too long or contain invalid characters.")

    if not dry_run:
        print(f"Total of {updates_needed} addresses updated in the {table} table.")
    else:
        print(f"Total of {updates_needed} addresses would be updated in the {table} table during the dry run.")

if __name__ == "__main__":
    verify_checksum()
