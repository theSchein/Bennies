from web3 import Web3  
from db.connection import connect_db
from utils.config import load_db 
import requests
import json
import time

def fetch_token_data(contract_address):
    config = load_db()
    api_key = config['alchemy_api_key']
    base_url = "https://eth-mainnet.g.alchemy.com/v2/"
    url = f"{base_url}{api_key}/gettoken/contract"

    params = {'contractAddress': contract_address}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching token data: {e}")
        return None

def fetch_collection_data(contract_address):
    config = load_db()
    api_key = config['alchemy_api_key']
    base_url = "https://eth-mainnet.g.alchemy.com/nft/v3/"
    url = f"{base_url}{api_key}/getContractMetadata"

    params = {'contractAddress': contract_address}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching collection data: {e}")
        return None

def user_submissions(retry_count=3, retry_delay=5):
    print("Starting the review process...")

    conn = connect_db()
    if conn is not None:
        with conn.cursor() as cursor:
            try:
                cursor.execute("SELECT submission_id, contract_address, token_type, name FROM staging.user_submissions WHERE reviewed = false")
                submissions = cursor.fetchall()
                
                for submission in submissions:
                    submission_id, contract_address, token_type, name = submission

                    print(f"\nReviewing submission ID: {submission_id}")
                    print(f"Contract Address: {contract_address}")
                    print(f"Token Type: {token_type}")
                    print(f"Name: {name}")

                    # Fetch the data based on token type
                    if token_type == 'ERC20':
                        token_data = fetch_token_data(contract_address)
                        if token_data:
                            print(f"Contract {contract_address} is a token, not an NFT collection.")
                            approval_status = True
                            collection_data = None
                        else:
                            print(f"Failed to fetch token data for contract address: {contract_address}")
                            approval_status = False
                            collection_data = None
                    else:
                        collection_data = fetch_collection_data(contract_address)
                        if collection_data:
                            print("Collection Data fetched successfully.")
                            print("Collection Data:", collection_data)
                            approval_status = True
                        else:
                            print(f"Failed to fetch collection data for contract address: {contract_address}")
                            approval_status = False

                    if approval_status:
                        is_publisher = input(f"Is there a publisher for this contract {contract_address}? (yes/no) [no]: ").strip().lower() or 'no'
                        if is_publisher == 'yes':
                            publisher_name = collection_data.get('name', 'Unknown Publisher') if collection_data else 'Unknown Publisher'
                        else:
                            publisher_name = None
                    
                    attempts = 0
                    while attempts < retry_count:
                        try:
                            # Update the submission as reviewed and set approval status
                            cursor.execute("""
                                UPDATE staging.user_submissions
                                SET reviewed = true, approved = %s
                                WHERE submission_id = %s
                            """, (approval_status, submission_id))
                            conn.commit()

                            if approval_status:
                                # Insert into staging_data table
                                json_data = json.dumps(collection_data) if collection_data else json.dumps(token_data)
                                cursor.execute("""
                                    INSERT INTO staging.staging_data (contract_address, token_type, publisher_name, data)
                                    VALUES (%s, %s, %s, %s)
                                    ON CONFLICT (contract_address) DO UPDATE SET
                                        token_type = EXCLUDED.token_type,
                                        publisher_name = EXCLUDED.publisher_name,
                                        data = EXCLUDED.data
                                """, (contract_address, token_type, publisher_name, json_data))
                                conn.commit()
                                print(f"Data staged successfully for contract address: {contract_address}")

                            break
                        except Exception as e:
                            print(f"An error occurred: {e}")
                            conn.rollback()
                            attempts += 1
                            if attempts < retry_count:
                                print(f"Retrying in {retry_delay} seconds...")
                                time.sleep(retry_delay)
                            else:
                                print("All attempts failed, operation aborted.")
                print("Review process completed.")
            finally:
                conn.close()
    else:
        print("Failed to connect to the database.")

if __name__ == '__main__':
    user_submissions()
