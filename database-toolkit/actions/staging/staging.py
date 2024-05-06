from web3 import Web3  
from db.connection import connect_db
from utils.config import load_config 
from .twitter_verify import get_verifier 
import requests
import json
import time

def fetch_collection_data(contract_address):
    config = load_config()
    api_key = config['alchemy_api_key']
    base_url = "https://eth-mainnet.g.alchemy.com/nft/v3/"
    url = f"{base_url}{api_key}/getContractMetadata"

    params = {'contractAddress': contract_address}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()  # Return the full collection data as JSON
    except requests.RequestException as e:
        print(f"Error fetching collection data: {e}")
        return None

def staging(retry_count=3, retry_delay=5):
    print("Starting the staging process...")
    contract_address_input = input("Enter the contract address: ")
    contract_address = Web3.to_checksum_address(contract_address_input)
    twitter_account = input("Enter the Twitter account name: ")
    collection_data = fetch_collection_data(contract_address)

    if collection_data:
        print("Collection Data:", collection_data)
    else:
        print("Failed to fetch collection data.")
        return  # Exit if no collection data is found

    verifier = get_verifier()
    if not verifier.account_is_active(twitter_account):
        print(f"Account {twitter_account} is inactive, aborting staging.")
        return

    conn = connect_db()
    if conn is not None:
        with conn.cursor() as cursor:
            attempts = 0
            while attempts < retry_count:
                try:
                    # Display what would happen in a dry run
                    print("Dry Run: Would insert the following data into staging.staging_data:")
                    print(f"Contract Address: {contract_address}, Twitter Account: {twitter_account}, Data: {collection_data}")

                    confirm = input("Do you want to proceed with actual insertion? (yes/no) [Yes]: ").strip().lower()
                    if confirm != 'no':
                        json_data = json.dumps(collection_data)  # Prepare JSON data for insertion
                        sql = """
                            INSERT INTO staging.staging_data (contract_address, twitter_account, data)
                            VALUES (%s, %s, %s)
                            ON CONFLICT (contract_address) DO UPDATE SET
                                twitter_account = EXCLUDED.twitter_account,
                                data = EXCLUDED.data
                            RETURNING contract_address;
                        """
                        cursor.execute(sql, (contract_address, twitter_account, json_data))
                        if cursor.rowcount > 0:
                            conn.commit()
                            print("Data staged successfully for contract address:", contract_address)
                            return
                        else:
                            print("No data inserted, update was made.")
                    else:
                        print("Operation cancelled by user.")
                        return
                except Exception as e:
                    print(f"An error occurred: {e}")
                    conn.rollback()
                    attempts += 1
                    if attempts < retry_count:
                        print(f"Retrying in {retry_delay} seconds...")
                        time.sleep(retry_delay)
                    else:
                        print("All attempts failed, operation aborted.")
                finally:
                    if conn:
                        conn.close()
    else:
        print("Failed to connect to the database.")

if __name__ == '__main__':
    staging()
