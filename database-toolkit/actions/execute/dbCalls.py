# dbCalls.py
import psycopg2
from psycopg2 import Error
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='.env.local')


DATABASE_URL = os.getenv("POSTGRES_URL")

# Initialize database connection (with context manager for automatic closing)
try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
except (Exception, Error) as error:
    print("Error connecting to database:", error)
    exit(1)

def get_contract_address_from_staging():
    query = "SELECT contract_address, publisher_name, metadata_added FROM staging.staging_data WHERE metadata_added IS NULL OR metadata_added = FALSE LIMIT 1;"
    try:
        cursor.execute(query)
        row = cursor.fetchone()
        if row:
            return row[0], row[1], row[2]
        else:
            print("No eligible contract address found in staging_data table.")
            return None, None, None
    except (Exception, Error) as error:
        print(f"Error fetching contract address: {error}")
        return None, None, None

def get_contracts_from_staging():
    query = "SELECT contract_address, publisher_name, metadata_added, token_type FROM staging.staging_data WHERE metadata_added IS NULL OR metadata_added = FALSE;"
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        return rows
    except (Exception, Error) as error:
        print(f"Error fetching contract addresses: {error}")
        return []



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

def update_token_ids(contract_address, name, token_ids, is_publisher=False):
    update_query = """
    UPDATE transform.{} SET token_ids = %s WHERE contract_address = %s AND {}_name = %s;
    """.format('publisher' if is_publisher else 'collection', 'name' if is_publisher else 'collection_name')
    try:
        cursor.execute(update_query, (token_ids, contract_address, name))
        conn.commit()
        print(f"Token IDs updated for {'publisher' if is_publisher else 'collection'} {name} with contract address {contract_address}")
    except (Exception, Error) as error:
        print(f"Error updating token IDs: {error}")
        conn.rollback()


def insert_publisher_to_db(publisher_data, token_ids):
    insert_query = """
    INSERT INTO transform.publisher (name, description, media_url, contract_address, token_ids)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        media_url = EXCLUDED.media_url,
        contract_address = EXCLUDED.contract_address,
        token_ids = EXCLUDED.token_ids
    RETURNING publisher_id;
    """
    try:
        cursor.execute(insert_query, (
            publisher_data['name'],
            publisher_data.get('description', None),
            publisher_data.get('media_url', None),
            publisher_data.get('contract_address', None),
            token_ids
        ))
        publisher_id = cursor.fetchone()[0]
        conn.commit()
        print("Publisher inserted/updated in transform table:", publisher_data['name'])
        return publisher_id
    except (Exception, Error) as error:
        print(f"Error inserting publisher data: {error}")
        conn.rollback()
        return None


def get_publisher_id(publisher_name):
    query = """
    SELECT publisher_id FROM transform.publisher
    WHERE name = %s;
    """
    try:
        cursor.execute(query, (publisher_name,))
        row = cursor.fetchone()
        if row:
            return row[0]
        else:
            return None
    except (Exception, Error) as error:
        print(f"Error fetching publisher ID: {error}")
        return None

def insert_nft_to_db(nft_data, collection_id, deployer_address, publisher_id):
    insert_query = """
    INSERT INTO transform.nft (contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners, publisher_id)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
        owners = EXCLUDED.owners,
        publisher_id = EXCLUDED.publisher_id;
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
            deployer_address,
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
            owners,
            publisher_id
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
        contract_metadata = token_data.get('contractMetadata', {})
        
        cursor.execute(insert_query, (
            token_data.get('name', ''),  # Token name
            token_data.get('symbol', ''),  # Token symbol
            token_data.get('logo', ''),  # Logo media
            None,  # Creation date (if not available, keep as None)
            token_data.get('address', ''),  # Contract address
            None,  # Deployer address (if not available, keep as None)
            token_data.get('totalSupply', None),  # Supply
            token_data.get('decimals', None),  # Decimals
            None,  # Token utility (if not available, keep as None)
            token_data.get('description', ''),  # Description
            None  # Category (if not available, keep as None)
        ))
        conn.commit()
        print(f"Token {token_data.get('name', 'UNKNOWN')} inserted/updated in the transform table.")
    except (Exception, Error) as error:
        print(f"Error inserting/updating token data: {error}")
        conn.rollback()  # Rollback the transaction



def get_token_ids(contract_address, is_publisher=False):
    query = """
    SELECT token_ids FROM transform.{} WHERE contract_address = %s;
    """.format('publisher' if is_publisher else 'collection')
    try:
        cursor.execute(query, (contract_address,))
        row = cursor.fetchone()
        if row:
            return row[0]
        else:
            return None
    except (Exception, Error) as error:
        print(f"Error fetching token IDs: {error}")
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
    
def nft_exists(contract_address, token_id):
    query = """
    SELECT 1 FROM transform.nft
    WHERE contract_address = %s AND token_id = %s;
    """
    try:
        cursor.execute(query, (contract_address, str(token_id)))  # Ensure token_id is treated as a string
        return cursor.fetchone() is not None
    except (Exception, Error) as error:
        print(f"Error checking if NFT exists: {error}")
        return False
    
def update_metadata_status(contract_address, status):
    query = "UPDATE staging.staging_data SET metadata_added = %s WHERE contract_address = %s;"
    try:
        cursor.execute(query, (status, contract_address))
        conn.commit()
        print(f"Metadata status updated for contract address {contract_address} to {status}")
    except (Exception, Error) as error:
        print(f"Error updating metadata status: {error}")
        conn.rollback()

def insert_into_verification_table(contract_address):
    insert_query = """
    INSERT INTO transform.verification (contract_address)
    VALUES (%s)
    ON CONFLICT (contract_address) DO NOTHING;
    """
    try:
        cursor.execute(insert_query, (contract_address,))
        conn.commit()
        print(f"Inserted {contract_address} into verification table.")
    except (Exception, Error) as error:
        print(f"Error inserting into verification table: {error}")
        conn.rollback()