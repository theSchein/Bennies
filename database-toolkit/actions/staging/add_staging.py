from web3 import Web3
from db.connection import connect_db
from utils.config import load_db 
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

def contract_exists_in_staging(contract_address, conn):
    """
    Checks if the contract address already exists in the staging_data table.

    Args:
        contract_address (str): The contract address to check.
        conn (psycopg2 connection): The database connection.

    Returns:
        bool: True if the contract address exists, False otherwise.
    """
    with conn.cursor() as cursor:
        cursor.execute("SELECT 1 FROM staging.staging_data WHERE contract_address = %s", (contract_address,))
        return cursor.fetchone() is not None

def add_staging(retry_count=3, retry_delay=5):
    print("Starting the staging process...")
    contract_address_input = input("Enter the contract address: ")
    contract_address = Web3.to_checksum_address(contract_address_input)

    # Prompt for token type
    token_type = input("Is this contract an ERC-20 token? (yes/no) [No]: ").strip().lower() or 'no'
    if token_type == 'yes':
        token_type = 'ERC20'
    else:
        token_type = 'ERC721'

    # First, try fetching token data
    if token_type == 'ERC20':
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

    # Prompt for publisher information
    is_publisher = input("Is there a publisher for this contract? (y/N): ").strip().lower() or 'n'
    publisher_name = None
    if is_publisher == 'y':
        print('Collection data:', collection_data)
        publisher_name = collection_data.get('name', 'Unknown Publisher')

    conn = connect_db()
    if conn is not None:
        with conn.cursor() as cursor:
            # Check if the contract already exists in staging
            if contract_exists_in_staging(contract_address, conn):
                print(f"Contract {contract_address} already exists in staging. Operation aborted.")
                return

            attempts = 0
            while attempts < retry_count:
                try:
                    # Display what would happen in a dry run
                    print("Dry Run: Would insert the following data into staging.staging_data:")
                    print(f"Contract Address: {contract_address}, Publisher Name: {publisher_name}, Token Type: {token_type}, Data: {collection_data}")

                    confirm = input("Do you want to proceed with actual insertion? (yes/no) [Yes]: ").strip().lower()
                    if confirm != 'no':
                        json_data = json.dumps(collection_data)  # Prepare JSON data for insertion
                        sql = """
                            INSERT INTO staging.staging_data (contract_address, publisher_name, token_type, data)
                            VALUES (%s, %s, %s, %s)
                            ON CONFLICT (contract_address) DO UPDATE SET
                                publisher_name = EXCLUDED.publisher_name,
                                token_type = EXCLUDED.token_type,
                                data = EXCLUDED.data
                            RETURNING contract_address;
                        """
                        cursor.execute(sql, (contract_address, publisher_name, token_type, json_data))
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
