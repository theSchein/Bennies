import os
from web3 import Web3
from dotenv import load_dotenv
from .dbCalls import (
    get_contracts_from_staging, 
    insert_token_to_db, get_token_ids, 
    update_token_ids, get_collection_id, 
    insert_collection_to_db, 
    insert_publisher_to_db, 
    nft_exists, 
    insert_nft_to_db, 
    update_metadata_status, 
    get_publisher_id,
    insert_into_verification_table
)
from utils.externalApiCalls import fetch_erc20, fetch_contract_metadata
from utils.nodeCalls import fetch_token_metadata, token_id_finder

# Load environment variables
load_dotenv(dotenv_path='.env.local')

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")

def process_contract(contract_address, publisher_name, token_type):
    try:
        contract_address = Web3.to_checksum_address(contract_address)
    except ValueError:
        print(f"Invalid contract address: {contract_address}")
        update_metadata_status(contract_address, False)
        return

    try:
        if token_type == 'ERC20':
            token_data = fetch_erc20(contract_address)
            if token_data:
                insert_token_to_db(token_data)
                print("Token data inserted into DB.")
                update_metadata_status(contract_address, True)
                insert_into_verification_table(contract_address)
                return
            else:
                print(f"Failed to fetch ERC-20 token data for contract address {contract_address}. Aborting.")
                update_metadata_status(contract_address, False)
                return

        print("Not an ERC-20 token. Proceeding to fetch contract metadata.")
        metadata_response = fetch_contract_metadata(contract_address)
        if metadata_response:
            existing_token_ids = get_token_ids(contract_address, is_publisher=bool(publisher_name))
            if existing_token_ids:
                print(f"Token IDs already exist for contract {metadata_response['name']}")
                token_ids = existing_token_ids
            else:
                token_ids = token_id_finder(contract_address, "ERC-721")
                if token_ids:
                    update_token_ids(contract_address, metadata_response['name'], token_ids, is_publisher=bool(publisher_name))

            publisher_id = None
            collection_id = None
            deployer_address = metadata_response.get('contractDeployer', None)

            if publisher_name:
                # Handle publisher logic
                publisher_data = {
                    'name': publisher_name,
                    'description': metadata_response.get('openSeaMetadata', {}).get('description', ''),
                    'media_url': metadata_response.get('openSeaMetadata', {}).get('imageUrl', ''),
                    'contract_address': contract_address  # Ensure this key is correctly set
                }
                publisher_id = get_publisher_id(contract_address)
                if not publisher_id:
                    publisher_id = insert_publisher_to_db(publisher_data, token_ids)
                else:
                    update_token_ids(contract_address, publisher_name, token_ids, is_publisher=True)

                if not publisher_id:
                    print(f"Failed to insert publisher for contract address {contract_address}. Aborting.")
                    update_metadata_status(contract_address, False)
                    return
            else:
                collection_id = get_collection_id(contract_address, metadata_response['name'])
                if not collection_id:
                    collection_id = insert_collection_to_db(metadata_response, token_ids)

            print(f"Collection ID: {collection_id}, Publisher ID: {publisher_id}")

            if (publisher_id or collection_id) and token_ids:
                for token_id in token_ids:
                    if nft_exists(contract_address, token_id):
                        print(f"NFT with contract address {contract_address} and token ID {token_id} already exists. Skipping fetch.")
                        continue

                    try:
                        response = fetch_token_metadata(contract_address, token_id, "ERC-721")
                        if response:
                            response['contract_address'] = contract_address
                            insert_nft_to_db(response, collection_id, deployer_address, publisher_id)  # Pass publisher_id
                    except Exception as e:
                        print("Error fetching token metadata:", e)
                update_metadata_status(contract_address, True)
                insert_into_verification_table(contract_address)
            else:
                update_metadata_status(contract_address, False)
        else:
            update_metadata_status(contract_address, False)
    except Exception as e:
        print(f"Error processing contract address {contract_address}: {e}")
        update_metadata_status(contract_address, False)

def execute_metadata():
    unprocessed_contracts = get_contracts_from_staging()
    if not unprocessed_contracts:
        print("No unprocessed contracts found.")
        return

    for contract_address, publisher_name, metadata_added, token_type in unprocessed_contracts:
        if metadata_added:
            print(f"Metadata already added for contract address {contract_address}. Skipping.")
            continue

        process_contract(contract_address, publisher_name, token_type)

if __name__ == "__main__":
    execute_metadata()
