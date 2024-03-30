import requests
import psycopg2
from psycopg2.extras import DictCursor
import os
from dotenv import load_dotenv
from urllib.parse import urlparse
import json
import time

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

def find_and_delete_duplicates(conn, dry_run=True):
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    # Find duplicates based on contract_address_token_id
    cursor.execute("""
        SELECT contract_address_token_id, COUNT(*)
        FROM nfts
        GROUP BY contract_address_token_id
        HAVING COUNT(*) > 1
    """)
    
    duplicates = cursor.fetchall()
    
    if not duplicates:
        print("No duplicates found.")
        return
    
    print(f"Found {len(duplicates)} duplicates.")
    
    if dry_run:
        print("This is a dry run. The following duplicates were found:")
        for dup in duplicates:
            print(f"Duplicate contract_address_token_id: {dup['contract_address_token_id']}, Count: {dup['count']}")
    else:
        user_input = input("Proceed with deleting duplicates? (yes/no): ")
        if user_input.lower() == 'yes':
            for dup in duplicates:
                # Keep one entry and delete the rest
                cursor.execute("""
                    DELETE FROM nfts
                    WHERE ctid NOT IN (
                        SELECT min(ctid)
                        FROM nfts
                        WHERE contract_address_token_id = %s
                        GROUP BY contract_address_token_id
                    )
                    AND contract_address_token_id = %s
                """, (dup['contract_address_token_id'], dup['contract_address_token_id']))
            conn.commit()
            print("Duplicates have been deleted.")
        else:
            print("Operation aborted. No changes were made.")
    
    cursor.close()

def fetch_image_url_from_token_uri(token_uri):
    """Fetch the image URL from a token URI, converting IPFS links to HTTP links."""
    try:
        # Convert IPFS URI to HTTP URL if necessary
        if token_uri.startswith("ipfs://"):
            token_uri = token_uri.replace("ipfs://", "https://ipfs.io/ipfs/")
        
        response = requests.get(token_uri, timeout=10)  # Added a timeout for the request
        response.raise_for_status()
        data = response.json()
        
        # Handle IPFS image URLs within the metadata
        image_url = data.get('image')
        if image_url and image_url.startswith("ipfs://"):
            image_url = image_url.replace("ipfs://", "https://ipfs.io/ipfs/")
        
        return image_url
    except requests.exceptions.Timeout:
        print(f"Timeout occurred fetching token URI {token_uri}")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error fetching token URI {token_uri}: {e}")
    except Exception as e:
        print(f"Error fetching or parsing token URI {token_uri}: {e}")
    return None


def update_nfts_media_url(conn, dry_run=True):
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    # Find all NFTs with no or null media_url
    cursor.execute("""
        SELECT nft_id, token_uri_gateway
        FROM nfts
        WHERE media_url IS NULL OR media_url = ''
    """)
    
    nfts_to_update = cursor.fetchall()
    
    if not nfts_to_update:
        print("No NFTs with missing media_url found.")
        return
    
    print(f"Found {len(nfts_to_update)} NFTs with missing media_url.")
    
    updates = []
    for nft in nfts_to_update:
        image_url = fetch_image_url_from_token_uri(nft['token_uri_gateway'])
        if image_url:
            updates.append((image_url, nft['nft_id']))
    
    # Dry run: display the changes without applying them
    if dry_run:
        print("This is a dry run. The following updates would be made:")
        for image_url, nft_id in updates:
            print(f"NFT ID {nft_id}: Update media_url to {image_url}")
    else:
        user_input = input("Proceed with updating media_url for NFTs? (yes/no): ")
        if user_input.lower() == 'yes':
            for image_url, nft_id in updates:
                update_query = """
                    UPDATE nfts
                    SET media_url = %s
                    WHERE nft_id = %s
                """
                cursor.execute(update_query, (image_url, nft_id))
            conn.commit()
            print("NFTs media_url have been updated.")
        else:
            print("Operation aborted. No changes were made.")
    
    cursor.close()

def main():
    conn = connect_db()
    if conn is not None:
        # Ask for dry run confirmation at the beginning
        dry_run_input = input("This script will modify the database. Would you like to perform a dry run first? (yes/no): ")
        dry_run = dry_run_input.lower() == 'yes'
        
        find_and_delete_duplicates(conn, dry_run=dry_run)
        update_nfts_media_url(conn, dry_run=dry_run)
        
        conn.close()

if __name__ == '__main__':
    main()
