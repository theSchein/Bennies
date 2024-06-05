import os
import requests
import time
import psycopg2
from dotenv import load_dotenv
from psycopg2 import Error  # For database error handling
from .dbCalls import get_contract_address_from_staging, insert_token_to_db, get_token_ids_from_collection, update_token_ids_in_collection, get_collection_id, insert_collection_to_db, nft_exists, insert_nft_to_db
from utils.externalApiCalls import fetch_erc20, fetch_collection_data
from utils.nodeCalls import fetch_token_metadata, token_id_finder

# Load environment variables
load_dotenv(dotenv_path='.env.local')

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")



def execute():
    contract_address, publisher_name = get_contract_address_from_staging()
    if not contract_address:
        return

    token_data = fetch_erc20(contract_address)
    if token_data:
        insert_token_to_db(token_data)
        print("Token data inserted into DB.")
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
                print(f"Token IDs found: {token_ids}")
                update_token_ids_in_collection(contract_address, coll_response['name'], token_ids)

        collection_id = get_collection_id(contract_address, coll_response['name'])
        deployer_address = coll_response.get('contractDeployer', None)  # Fetch deployer address from collection data
        if not collection_id:
            collection_id = insert_collection_to_db(coll_response, token_ids)

        print(f"Collection ID: {collection_id}")

        if token_ids:
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


if __name__ == "__main__":
    execute()
