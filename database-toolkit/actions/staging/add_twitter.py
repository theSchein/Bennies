from web3 import Web3
from db.connection import connect_db

def add_twitter():
    print("Starting the staging process...")
    
    # Get contract address from the user
    contract_address_input = input("Enter the contract address: ")
    contract_address = contract_address_input

    # Get Twitter account name from the user
    twitter_account = input("Enter the Twitter account name: ").strip()
    if not twitter_account:
        print("Twitter account name is required.")
        return
    
    conn = connect_db()
    if conn is not None:
        with conn.cursor() as cursor:
            try:
                # Check if the contract address exists in the staging table
                cursor.execute("SELECT contract_address FROM staging.staging_data WHERE contract_address = %s", (contract_address,))
                result = cursor.fetchone()

                if result:
                    # Update the twitter_account field for the existing contract address
                    cursor.execute("""
                        UPDATE staging.staging_data
                        SET twitter_account = %s
                        WHERE contract_address = %s
                    """, (twitter_account, contract_address))
                    conn.commit()
                    print(f"Twitter account {twitter_account} added successfully for contract address {contract_address}.")
                else:
                    print(f"Contract address {contract_address} not found in staging data.")
            except Exception as e:
                print(f"An error occurred: {e}")
                conn.rollback()
            finally:
                if conn:
                    conn.close()
    else:
        print("Failed to connect to the database.")

if __name__ == '__main__':
    add_twitter()
