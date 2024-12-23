## nfts_data_filler.py
import requests
import psycopg2
from psycopg2.extras import DictCursor
import os
from dotenv import load_dotenv
from urllib.parse import urlparse
import json
import argparse

# Load environment variables
load_dotenv(dotenv_path='.env.local')

# Database connection parameters
DB_PARAMS = {
    'dbname': os.getenv('POSTGRES_DATABASE'),
    'user': os.getenv('POSTGRES_USER'),
    'password': os.getenv('POSTGRES_PASSWORD'),
    'host': os.getenv('POSTGRES_HOST')
}

def connect_db():
    """Connect to the PostgreSQL database server."""
    conn = None
    try:
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**DB_PARAMS)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    return conn

def fetch_metadata_from_token_uri(token_uri):
    """Fetch the metadata from a token URI."""
    try:
        # Check if the token URI is an IPFS URI and convert it to a HTTP URL
        if token_uri.startswith('ipfs://'):
            token_uri = token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
        
        response = requests.get(token_uri, timeout=10)  # Set a reasonable timeout
        response.raise_for_status()
        data = response.json()
        return data
    except Exception as e:
        print(f"Error fetching or parsing token URI {token_uri}: {e}")
        return None

def update_nfts_metadata(conn, contract_address=None, dry_run=True):
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    # Find all NFTs with no or null names or descriptions
    sql_query = """
        SELECT nft_id, token_uri_gateway
        FROM nfts
        WHERE (nft_name IS NULL OR nft_name = '' OR nft_description IS NULL OR nft_description = '') {}
    """.format(f"AND contract_address = '{contract_address}'" if contract_address else "")

    cursor.execute(sql_query)
    
    nfts_to_update = cursor.fetchall()
    
    if not nfts_to_update:
        print("No NFTs with missing names or descriptions found.")
        return
    
    print(f"Found {len(nfts_to_update)} NFTs with missing names or descriptions.")
    
    for nft in nfts_to_update:
        metadata = fetch_metadata_from_token_uri(nft['token_uri_gateway'])
        if metadata:
            name = metadata.get('name')
            description = metadata.get('description')
            if dry_run:
                print(f"Dry run: NFT ID {nft['nft_id']} would be updated with Name: {name}, Description: {description}")
            else:
                update_query = """
                    UPDATE nfts
                    SET nft_name = %s, nft_description = %s
                    WHERE nft_id = %s
                """
                cursor.execute(update_query, (name, description, nft['nft_id']))
    
    if not dry_run:
        conn.commit()
        print("NFTs metadata have been updated.")
    
    cursor.close()

def main():
    parser = argparse.ArgumentParser(description='Update NFT metadata for a specific collection or all collections.')
    parser.add_argument('--contract_address', type=str, help='Contract Addy to update NFTs for', default=None)
    args = parser.parse_args()
    conn = connect_db()
    if conn is not None:
        dry_run_input = input("Perform a dry run? (yes/no): ").lower() == 'yes'
        update_nfts_metadata(conn, contract_address=args.contract_address, dry_run=dry_run_input)
        conn.close()

if __name__ == '__main__':
    main()
