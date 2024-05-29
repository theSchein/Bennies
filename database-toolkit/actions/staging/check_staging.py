# actions/staging/check_staging.py
from db.connection import connect_db
from psycopg2.extras import DictCursor

def check_staging():
    print("Checking the staging table for entries...")
    conn = connect_db()
    if not conn:
        print("Failed to connect to the database.")
        return

    try:
        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute("SELECT contract_address, twitter_account, data FROM staging.staging_data")
        rows = cursor.fetchall()

        if rows:
            print("Staging Table Entries:")
            for row in rows:
                contract_address = row['contract_address']
                twitter_account = row['twitter_account']
                data = row['data']
                
                contract_name = data.get('name', 'N/A')
                num_items = data.get('totalSupply', 'N/A')

                print(f"Contract Address: {contract_address}, Contract Name: {contract_name}, Twitter Account: {twitter_account}, Number of Items: {num_items}")
        else:
            print("No entries found in the staging table.")
    except Exception as e:
        print(f"An error occurred while checking the staging table: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    check_staging()
