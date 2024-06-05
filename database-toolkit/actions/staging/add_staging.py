from web3 import Web3  
from db.connection import connect_db
from utils.config import load_db 
from .twitter_verify import get_verifier 
import requests
import json
import time

def fetch_token_data(contract_address):
    """
    Fetches token data from Alchemy for a given contract address.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The token data as a dictionary, or None if an error occurs or it's an NFT contract.
    """
    config = load_db()
    api_key = config['alchemy_api_key']
    base_url = "https://eth-mainnet.g.alchemy.com/v2/"
    url = f"{base_url}{api_key}/gettoken/contract"

    params = {'contractAddress': contract_address}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()  # Return the full token data as JSON
    except requests.RequestException as e:
        print(f"Error fetching token data: {e}")
        return None

def fetch_collection_data(contract_address):
    """
    Fetches collection data from Alchemy for a given contract address.
    This is only called if the contract_address is not a token contract.

    Args:
        contract_address (str): The contract address to query.

    Returns:
        dict: The collection data as a dictionary, or None if an error occurs.
    """
    config = load_db()
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

def add_staging(retry_count=3, retry_delay=5):
    print("Starting the staging process...")
    contract_address_input = input("Enter the contract address: ")
    contract_address = Web3.to_checksum_address(contract_address_input)

    # Get Twitter account (optional)
    twitter_account = input("Enter the Twitter account name (optional): ")
    if twitter_account.strip() == "":
        twitter_account = None  # Set to None if empty string is entered

    # First, try fetching token data
    token_data = fetch_token_data(contract_address)

    if token_data:
        print(f"Contract {contract_address} is a token, not an NFT collection.")
        # Handle token data (logic not shown here)
        return

    # If token data fetch fails, or contract_address is not a token, proceed with NFT logic
    collection_data = fetch_collection_data(contract_address)

    if collection_data:
        print("Collection Data:", collection_data)
    else:
        print("Failed to fetch collection data.")
        return

    if twitter_account:
        verifier = get_verifier()
        if not verifier.account_is_active(twitter_account):
            print(f"Account {twitter_account} is inactive, aborting staging.")
            return

    # Prompt for publisher information
    is_publisher = input("Is there a publisher for this contract? (Y/n): ").strip().lower()
    publisher_name = None
    if is_publisher == 'y':
        publisher_name = input("Enter the publisher name: ")

    conn = connect_db()
    if conn is not None:
        with conn.cursor() as cursor:
            attempts = 0
            while attempts < retry_count:
                try:
                    # Display what would happen in a dry run
                    print("Dry Run: Would insert the following data into staging.staging_data:")
                    print(f"Contract Address: {contract_address}, Twitter Account: {twitter_account}, Publisher Name: {publisher_name}, Data: {collection_data}")

                    confirm = input("Do you want to proceed with actual insertion? (yes/no) [Yes]: ").strip().lower()
                    if confirm != 'no':
                        json_data = json.dumps(collection_data)  # Prepare JSON data for insertion
                        sql = """
                            INSERT INTO staging.staging_data (contract_address, twitter_account, publisher_name, data)
                            VALUES (%s, %s, %s, %s)
                            ON CONFLICT (contract_address) DO UPDATE SET
                                twitter_account = EXCLUDED.twitter_account,
                                publisher_name = EXCLUDED.publisher_name,
                                data = EXCLUDED.data
                            RETURNING contract_address;
                        """
                        cursor.execute(sql, (contract_address, twitter_account, publisher_name, json_data))
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
    add_staging()
