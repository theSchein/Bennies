from db.connection import connect_db
from psycopg2.extras import DictCursor

def check_duplicates():
    conn = connect_db()
    if conn is None:
        print("Failed to connect to the database.")
        return

    cursor = conn.cursor(cursor_factory=DictCursor)
    print("Scanning the entire database for duplicates, this could take a few minutes...")

    try:
        # Perform dry run initially
        print("Performing dry run to identify duplicates...")
        nft_duplicates, collection_duplicates = find_duplicates(cursor)

        # Ask user if they want to delete duplicates after dry run
        if input("Dry run complete. Delete duplicates? (yes/no): ").lower() == 'yes':
            # Proceed with deletion if confirmed
            handle_deletion(cursor, nft_duplicates, 'nfts')
            handle_deletion(cursor, collection_duplicates, 'collections', additional_field='collection_name', check_nfts=True)
            conn.commit()
            print("Deletion of duplicates completed successfully.")
        else:
            print("No changes made. Exiting.")

    except Exception as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def find_duplicates(cursor):
    # Check duplicates in NFTs
    cursor.execute("""
        SELECT contract_address_token_id, COUNT(*)
        FROM nfts
        GROUP BY contract_address_token_id
        HAVING COUNT(*) > 1
    """)
    nft_duplicates = cursor.fetchall()
    report_duplicates(nft_duplicates, 'NFT')

    # Check duplicates in Collections
    cursor.execute("""
        SELECT contract_address, collection_name, COUNT(*)
        FROM collections
        GROUP BY contract_address, collection_name
        HAVING COUNT(*) > 1
    """)
    collection_duplicates = cursor.fetchall()
    report_duplicates(collection_duplicates, 'Collection', additional_field='collection_name')

    return nft_duplicates, collection_duplicates

def report_duplicates(duplicates, entity_type, additional_field=None):
    if duplicates:
        print(f"Found {len(duplicates)} duplicate {entity_type}s.")
        for dup in duplicates:
            if additional_field:
                print(f"Duplicate {entity_type} {dup['contract_address']}, {additional_field}: {dup[additional_field]}, Count: {dup['count']}")
            else:
                print(f"Duplicate {entity_type} contract_address_token_id: {dup['contract_address_token_id']}, Count: {dup['count']}")
    else:
        print(f"No duplicate {entity_type}s found.")

def handle_deletion(cursor, duplicates, table, additional_field=None, check_nfts=False):
    total_deleted = 0
    for dup in duplicates:
        contract_id_field = 'contract_address_token_id' if table == 'nfts' else 'contract_address'
        values = (dup[contract_id_field],)
        where_clause = f"{contract_id_field} = %s"

        if additional_field:
            where_clause += f" AND {additional_field} = %s"
            values += (dup[additional_field],)

        # Check for related NFTs before deleting a collection
        if check_nfts:
            cursor.execute("""
                SELECT COUNT(*) FROM nfts WHERE contract_address = %s;
            """, (dup['contract_address'],))
            nft_count = cursor.fetchone()[0]
            if nft_count > 0:
                print(f"Skipping deletion for collection {dup['contract_address']} as it has {nft_count} related NFTs.")
                continue
            else:
                print(f"Collection {dup['contract_address']} has no related NFTs.")

        delete_query = f"""
            DELETE FROM {table}
            WHERE ctid IN (
                SELECT ctid
                FROM {table}
                WHERE {where_clause}
                ORDER BY ctid
                OFFSET 1
            )
            AND {where_clause};
        """
        cursor.execute(delete_query, values)
        deleted_count = cursor.rowcount
        total_deleted += deleted_count
        print(f"Deleted {deleted_count} duplicate records for {dup[contract_id_field]}.")

    if total_deleted > 0:
        print(f"Total duplicates deleted from {table}: {total_deleted}")
    else:
        print(f"No duplicates deleted from {table}.")

if __name__ == "__main__":
    check_duplicates()
