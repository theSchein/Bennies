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
    """
    Fetches the contract address to process from the staging_data table.

    Returns:
        str: The contract address from the staging table, or None if not found.
    """
    query = "SELECT contract_address FROM staging.staging_data LIMIT 1;"
    try:
        cursor.execute(query)
        row = cursor.fetchone()
        if row:
            return row[0]
        else:
            print("No contract address found in staging_data table.")
            return None
    except (Exception, Error) as error:
        print(f"Error fetching contract address: {error}")
        return None



def insert_collection_to_db(collection_data):
    print("Inserting collection data into temporary transform table:",collection_data)
    insert_query = """
    INSERT INTO tmp_collection (collection_name, num_collection_items, deployer_address, contract_address, token_type, nft_licence, collection_description, media_url, collection_utility, category)
    VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (collection_id) DO NOTHING;
    """
    try:
        cursor.execute(insert_query, (
            collection_data['name'],
            collection_data.get('num_collection_items', None),
            collection_data.get('deployer_address', None),
            collection_data.get('contract_address', None),
            collection_data.get('token_type', None),
            collection_data.get('nft_licence', None),
            collection_data.get('collection_description', None),
            collection_data.get('media_url', None),
            collection_data.get('collection_utility', None),
            collection_data.get('category', None)
        ))
        conn.commit()
        print("Collection inserted into temporary transform table:", collection_data['name'])
    except (Exception, Error) as error:
        print(f"Error inserting collection data: {error}")
        # Consider retry logic or logging the error


def insert_nft_to_db(nft_data, collection_id):
    insert_query = """
    INSERT INTO transform.tmp_nft (contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (contract_address_token_id) DO NOTHING;
    """
    try:
        cursor.execute(insert_query, (
            nft_data.get('contract_address_token_id', None),
            collection_id,
            nft_data.get('contract_address', None),
            nft_data.get('deployer_address', None),
            nft_data.get('token_type', None),
            nft_data.get('token_uri_gateway', None),
            nft_data.get('nft_description', None),
            nft_data.get('token_id', None),
            nft_data.get('creation_date', None),
            nft_data.get('media_url', None),
            nft_data.get('nft_sales_link', None),
            nft_data.get('nft_licence', None),
            nft_data.get('nft_context', None),
            nft_data.get('nft_utility', None),
            nft_data.get('category', None),
            nft_data.get('owners', None)
        ))
        conn.commit()
        print(f"NFT {nft_data.get('token_id', 'UNKNOWN')} inserted into temporary transform table.")
    except (Exception, Error) as error:
        print(f"Error inserting NFT data: {error}")
        # Consider retry logic or logging the error

def insert_token_to_db(token_data):
    """
    Inserts/updates a token's data into the temporary transform table.

    Parameters:
    - token_data: A dictionary containing the token's data.
    """
    insert_query = """
    INSERT INTO transform.tmp_token (token_name, token_symbol, logo_media, creation_date, contract_address, deployer_address, supply, decimals, token_utility, description, category)
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
        print(f"Token {token_data.get('name', 'UNKNOWN')} inserted/updated in the temporary transform table.")
    except (Exception, Error) as error:
        print(f"Error inserting/updating token data: {error}")
        # Consider retry logic or logging the error


def execute():
    # Fetch contract address from staging table
    contract_address = get_contract_address_from_staging()
    if not contract_address:
        return

    # Check if it's an ERC-20 token
    token_data = fetch_erc20(contract_address)
    if token_data:
        insert_token_to_db(token_data)
        print("Token data inserted into DB.")
        return  # Exit the function if it's an ERC-20 token

    # If it's not an ERC-20 token, proceed to fetch collection data
    print("Not an ERC-20 token. Proceeding to fetch collection data.")

    # Fetch collection data
    coll_response = fetch_collection_data(contract_address)
    if coll_response:
        insert_collection_to_db(coll_response)
        cursor = conn.cursor()  # Initialize cursor
        collection_id = cursor.lastrowid  # Assuming the collection table has an auto-incrementing ID

        # Fetch token IDs
        token_ids = token_id_finder(contract_address, "ERC-721")
        if token_ids:
            for token_id in token_ids:
                # Fetch and insert NFT data for each token ID
                try:
                    response = fetch_token_metadata(contract_address, token_id, "ERC-721")
                    if response:
                        insert_nft_to_db(response, collection_id)
                except Exception as e:
                    print("Error fetching token metadata:", e)

if __name__ == "__main__":
    execute()