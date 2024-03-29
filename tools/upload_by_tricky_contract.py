import os
import requests
import time
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='.env.local')

ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")
DATABASE_URL = os.getenv("POSTGRES_URL")

# Initialize database connection
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

def get_contract_metadata(contract_address):
    # Assuming Alchemy's NFT API v3 and including the API key as a query parameter
    url = f"https://eth-mainnet.g.alchemy.com/nft/v3/getNFTMetadata"
    params = {
        "contractAddress": contract_address,
        "tokenId": "1",  # Example tokenId, adjust as necessary
        "refreshCache": "false",
        "apiKey": ALCHEMY_API_KEY  # Include your API key as a query parameter
    }
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching contract metadata: {response.status_code}, {response.text}")
        return None


def get_nfts_by_contract(contract_address, cursor=None):
    url = f"https://deep-index.moralis.io/api/v2/nft/{contract_address}"
    headers = {
        "X-API-Key": MORALIS_API_KEY,
        "accept": "application/json"
    }
    params = {"chain": "eth", "format": "decimal"}
    if cursor:
        params["cursor"] = cursor
    response = requests.get(url, headers=headers, params=params)
    return response.json()

def insert_collection_to_db(collection_data):
    insert_query = """
    INSERT INTO collections (contract_address, collection_name, token_type, num_collection_items, deployer_address)
    VALUES (%s, %s, %s, %s, %s) ON CONFLICT (contract_address) DO NOTHING;
    """
    cursor.execute(insert_query, (
        collection_data['contract_address'],
        collection_data['name'],
        collection_data['tokenType'],
        collection_data['totalSupply'],
        collection_data['contractDeployer'],
    ))
    conn.commit()
    print("Collection inserted into DB:", collection_data['name'])

def insert_nft_to_db(nft_data, collection_id):
    """
    Inserts a single NFT's data into the database.

    Parameters:
    - nft_data: A dictionary containing the NFT's data.
    - collection_id: The ID of the collection this NFT belongs to.
    """
    insert_query = """
    INSERT INTO nfts (contract_address, token_id, name, token_type, token_uri, media_url, deployer_address, description, owner_address, collection_id)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (contract_address, token_id) DO UPDATE SET
    name = EXCLUDED.name,
    token_type = EXCLUDED.token_type,
    token_uri = EXCLUDED.token_uri,
    media_url = EXCLUDED.media_url,
    deployer_address = EXCLUDED.deployer_address,
    description = EXCLUDED.description,
    owner_address = EXCLUDED.owner_address,
    collection_id = EXCLUDED.collection_id;
    """
    cursor.execute(insert_query, (
        nft_data['contract_address'],
        nft_data['token_id'],
        nft_data.get('name', ''),
        nft_data.get('token_type', ''),
        nft_data.get('token_uri', ''),
        nft_data.get('media_url', ''),
        nft_data.get('deployer_address', ''),
        nft_data.get('description', ''),
        nft_data.get('owner', {}).get('owner_address', ''),  # Assuming 'owner' is a dict containing 'owner_address'
        collection_id,
    ))
    conn.commit()
    print(f"NFT {nft_data['token_id']} inserted/updated in the database.")


def main(contract_address):
    # Fetch and print collection data
    coll_response = get_contract_metadata(contract_address)
    insert_collection_to_db(coll_response)

    # Fetch and print NFT data
    cursor = None
    while True:
        response = get_nfts_by_contract(contract_address, cursor)
        for nft in response.get("result", []):
            insert_nft_to_db(nft)
        cursor = response.get("cursor")
        if not cursor:
            break
        time.sleep(1.75)  # Respect rate limits

if __name__ == "__main__":
    contract_address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"  # Specify the contract address
    main(contract_address)

# Close database connection
cursor.close()
conn.close()