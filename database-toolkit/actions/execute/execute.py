import os
import requests
import time
import psycopg2
from dotenv import load_dotenv
from psycopg2 import Error  # For database error handling
from utils.externalApiCalls import fetch_erc20, fetch_collection_data
from utils.nodeCalls import fetch_token_metadata, token_id_finder

# Load environment variables
load_dotenv(dotenv_path='.env.local')

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")
DATABASE_URL = os.getenv("POSTGRES_URL")

# Initialize database connection (with context manager for automatic closing)
try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
except (Exception, Error) as error:
    print("Error connecting to database:", error)
    exit(1)

def get_contract_address_from_staging():
    query = "SELECT contract_address, publisher_name FROM staging.staging_data LIMIT 1;"
    try:
        cursor.execute(query)
        row = cursor.fetchone()
        if row:
            return row[0], row[1]
        else:
            print("No contract address found in staging_data table.")
            return None, None
    except (Exception, Error) as error:
        print(f"Error fetching contract address: {error}")
        return None, None

def collection_exists(contract_address, collection_name):
    query = """
    SELECT 1 FROM transform.collection
    WHERE contract_address = %s AND collection_name = %s;
    """
    try:
        cursor.execute(query, (contract_address, collection_name))
        return cursor.fetchone() is not None
    except (Exception, Error) as error:
        print(f"Error checking if collection exists: {error}")
        return False

def insert_collection_to_db(collection_data, token_ids):
    print("Inserting collection data into transform table:", collection_data)
    insert_query = """
    INSERT INTO transform.collection (collection_name, num_collection_items, deployer_address, contract_address, token_type, nft_licence, collection_description, media_url, collection_utility, category, token_ids)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (contract_address, collection_name) DO NOTHING
    RETURNING collection_id;
    """
    try:
        cursor.execute(insert_query, (
            collection_data['name'],
            collection_data.get('totalSupply', None),
            collection_data.get('contractDeployer', None),
            collection_data.get('address', None),
            collection_data.get('tokenType', None),
            collection_data.get('nft_licence', None),
            collection_data.get('openSeaMetadata', {}).get('description', None),
            collection_data.get('openSeaMetadata', {}).get('imageUrl', None),
            collection_data.get('collection_utility', None),
            collection_data.get('category', None),
            token_ids
        ))
        collection_id = cursor.fetchone()[0]
        conn.commit()
        print("Collection inserted into transform table:", collection_data['name'])
        return collection_id
    except (Exception, Error) as error:
        print(f"Error inserting collection data: {error}")
        conn.rollback()
        return None

def update_token_ids_in_collection(contract_address, collection_name, token_ids):
    update_query = """
    UPDATE transform.collection
    SET token_ids = %s
    WHERE contract_address = %s AND collection_name = %s;
    """
    try:
        cursor.execute(update_query, (token_ids, contract_address, collection_name))
        conn.commit()
        print(f"Token IDs updated for collection {collection_name} with contract address {contract_address}")
    except (Exception, Error) as error:
        print(f"Error updating token IDs in collection: {error}")
        conn.rollback()

def insert_nft_to_db(nft_data, collection_id):
    insert_query = """
    INSERT INTO transform.nft (contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (contract_address_token_id) DO UPDATE SET
        collection_id = EXCLUDED.collection_id,
        contract_address = EXCLUDED.contract_address,
        deployer_address = EXCLUDED.deployer_address,
        token_type = EXCLUDED.token_type,
        token_uri_gateway = EXCLUDED.token_uri_gateway,
        nft_description = EXCLUDED.nft_description,
        token_id = EXCLUDED.token_id,
        creation_date = EXCLUDED.creation_date,
        media_url = EXCLUDED.media_url,
        nft_sales_link = EXCLUDED.nft_sales_link,
        nft_licence = EXCLUDED.nft_licence,
        nft_context = EXCLUDED.nft_context,
        nft_utility = EXCLUDED.nft_utility,
        category = EXCLUDED.category,
        owners = EXCLUDED.owners;
    """
    try:
        contract_address_token_id = f"{nft_data['contract_address']}_{nft_data['token_id']}"
        owners = nft_data.get('owner', None)
        if owners:
            owners = [owners] if not isinstance(owners, list) else owners

        cursor.execute(insert_query, (
            contract_address_token_id,
            collection_id,
            nft_data.get('contract_address', None),
            nft_data.get('deployer_address', None),
            nft_data.get('contractType', None),
            nft_data.get('tokenURI', None),
            nft_data.get('description', None),
            nft_data.get('token_id', None),
            nft_data.get('creation_date', None),
            nft_data.get('image', None),
            nft_data.get('animation_url', None),
            nft_data.get('nft_licence', None),
            nft_data.get('nft_context', None),
            nft_data.get('nft_utility', None),
            nft_data.get('category', None),
            owners
        ))
        conn.commit()
        print(f"NFT {nft_data.get('token_id', 'UNKNOWN')} inserted into transform table.")
    except (Exception, Error) as error:
        print(f"Error inserting NFT data: {error}")
        conn.rollback()  # Rollback the transaction

def insert_token_to_db(token_data):
    insert_query = """
    INSERT INTO transform.token (token_name, token_symbol, logo_media, creation_date, contract_address, deployer_address, supply, decimals, token_utility, description, category)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (contract_address) DO UPDATE SET
    token_name = EXCLUDED.token_name,
    token_symbol = EXCLUDED.token_symbol,
    logo_media = EXCLUDED.logo_media,
    creation_date = EXCLUDED.creation_date,
    supply = EXCLUDED.supply,
    decimals = EXCLUDED.decimals,
    token_utility = EXCLUDED.token_utility,
    description = EXCLUDED.description,
    category = EXCLUDED.category;
    """
    try:
        cursor.execute(insert_query, (
            token_data.get('name', ''),  # Handle potential missing field
            token_data.get('symbol', ''),  # Handle potential missing field
            token_data.get('logo_media', ''),  # Handle potential missing field
            token_data.get('creation_date', None),  # Handle potential missing field
            token_data.get('contract_address', ''),  # Handle potential missing field
            token_data.get('deployer_address', ''),  # Handle potential missing field
            token_data.get('supply', None),  # Handle potential missing field
            token_data.get('decimals', None),  # Handle potential missing field
            token_data.get('token_utility', ''),  # Handle potential missing field
            token_data.get('description', ''),  # Handle potential missing field
            token_data.get('category', '')  # Handle potential missing field
        ))
        conn.commit()
        print(f"Token {token_data.get('name', 'UNKNOWN')} inserted/updated in the transform table.")
    except (Exception, Error) as error:
        print(f"Error inserting/updating token data: {error}")
        conn.rollback()  # Rollback the transaction

def get_token_ids_from_collection(contract_address):
    query = """
    SELECT token_ids FROM transform.collection
    WHERE contract_address = %s;
    """
    try:
        cursor.execute(query, (contract_address,))
        row = cursor.fetchone()
        if row:
            return row[0]
        else:
            return None
    except (Exception, Error) as error:
        print(f"Error fetching token IDs from collection: {error}")
        return None

def get_collection_id(contract_address, collection_name):
    query = """
    SELECT collection_id FROM transform.collection
    WHERE contract_address = %s AND collection_name = %s;
    """
    try:
        cursor.execute(query, (contract_address, collection_name))
        row = cursor.fetchone()
        if row:
            return row[0]
        else:
            return None
    except (Exception, Error) as error:
        print(f"Error fetching collection ID: {error}")
        return None

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
        if not collection_id:
            collection_id = insert_collection_to_db(coll_response, token_ids)
        
        print(f"Collection ID: {collection_id}")

        if token_ids:
            for token_id in token_ids:
                try:
                    response = fetch_token_metadata(contract_address, token_id, "ERC-721")
                    if response:
                        response['collection_id'] = collection_id
                        response['contract_address'] = contract_address
                        insert_nft_to_db(response, collection_id)
                except Exception as e:
                    print("Error fetching token metadata:", e)

if __name__ == "__main__":
    execute()