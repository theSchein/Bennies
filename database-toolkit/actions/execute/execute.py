import os
from web3 import Web3
from dotenv import load_dotenv
from .dbCalls import get_contracts_from_staging, insert_token_to_db, get_token_ids_from_collection, update_token_ids_in_collection, get_collection_id, insert_collection_to_db, nft_exists, insert_nft_to_db, update_metadata_status
from utils.externalApiCalls import fetch_erc20, fetch_collection_data
from utils.nodeCalls import fetch_token_metadata, token_id_finder

# Load environment variables
load_dotenv(dotenv_path='.env.local')

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")

def process_contract(contract_address, publisher_name):
    try:
        contract_address = Web3.to_checksum_address(contract_address)
    except ValueError:
        print(f"Invalid contract address: {contract_address}")
        update_metadata_status(contract_address, False)
        return

    try:
        token_data = fetch_erc20(contract_address)
        if token_data:
            insert_token_to_db(token_data)
            print("Token data inserted into DB.")
            update_metadata_status(contract_address, True)
            return

        print("Not an ERC-20 token. Proceeding to fetch collection data.")
        coll_response = fetch_collection_data(contract_address)
        if coll_response:
            existing_token_ids = get_token_ids_from_collection(contract_address)
            if existing_token_ids:
                print(f"Token IDs already exist for collection {coll_response['name']}")
                token_ids = existing_token_ids
            else:
                token_ids = token_id_finder(contract_address, "ERC-721")
                if token_ids:
                    update_token_ids_in_collection(contract_address, coll_response['name'], token_ids)

            collection_id = get_collection_id(contract_address, coll_response['name'])
            deployer_address = coll_response.get('contractDeployer', None)  # Fetch deployer address from collection data
            if not collection_id:
                collection_id = insert_collection_to_db(coll_response, token_ids)

            print(f"Collection ID: {collection_id}")

            if collection_id and token_ids:
                for token_id in token_ids:
                    if nft_exists(contract_address, token_id):
                        print(f"NFT with contract address {contract_address} and token ID {token_id} already exists. Skipping fetch.")
                        continue

                    try:
                        response = fetch_token_metadata(contract_address, token_id, "ERC-721")
                        if response:
                            response['collection_id'] = collection_id
                            response['contract_address'] = contract_address
                            insert_nft_to_db(response, collection_id, deployer_address)  # Pass deployer address
                    except Exception as e:
                        print("Error fetching token metadata:", e)
                update_metadata_status(contract_address, True)
            else:
                update_metadata_status(contract_address, False)
        else:
            update_metadata_status(contract_address, False)
    except Exception as e:
        print(f"Error processing contract address {contract_address}: {e}")
        update_metadata_status(contract_address, False)

def execute():
    unprocessed_contracts = get_contracts_from_staging()
    if not unprocessed_contracts:
        print("No unprocessed contracts found.")
        return

    for contract_address, publisher_name, metadata_added in unprocessed_contracts:
        if metadata_added:
            print(f"Metadata already added for contract address {contract_address}. Skipping.")
            continue

        process_contract(contract_address, publisher_name)

if __name__ == "__main__":
    execute()
