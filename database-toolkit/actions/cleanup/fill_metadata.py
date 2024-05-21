from db.connection import connect_db
from psycopg2.extras import DictCursor
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
import json

def fetch_metadata_from_token_uri(token_uri):
    """Fetch metadata from a given token URI with retries."""
    session = requests.Session()
    retries = Retry(total=5, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
    session.mount('http://', HTTPAdapter(max_retries=retries))
    session.mount('https://', HTTPAdapter(max_retries=retries))

    try:
        response = session.get(token_uri)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Failed to fetch metadata from {token_uri}: {e}")
        return None

def fill_metadata():
    print("Fetching metadata and updating database...")
    conn = connect_db()
    if conn is None:
        print("Failed to connect to the database.")
        return

    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        cursor.execute("""
            SELECT nft_id, token_uri_gateway
            FROM nfts
            WHERE media_url IS NULL OR media_url = ''
        """)
        nfts = cursor.fetchall()

        if not nfts:
            print("No NFTs with missing media URLs found.")
            return

        print(f"Found {len(nfts)} NFTs with missing media URLs.")

        for nft in nfts:
            metadata = fetch_metadata_from_token_uri(nft['token_uri_gateway'])
            if metadata and 'image' in metadata:
                update_data = {
                    'media_url': metadata['image'],
                    'nft_name': metadata.get('name', ''),
                    'nft_description': metadata.get('description', '')
                }
                cursor.execute("""
                    UPDATE nfts
                    SET media_url = %s, nft_name = %s, nft_description = %s
                    WHERE nft_id = %s
                """, (update_data['media_url'], update_data['nft_name'], update_data['nft_description'], nft['nft_id']))
                conn.commit()  # Commit immediately after each successful update
                print(f"Updated NFT ID {nft['nft_id']} with new media URL: {update_data['media_url']}")
                if update_data['nft_name']:
                    print(f" - Also updated name to: {update_data['nft_name']}")
                if update_data['nft_description']:
                    print(f" - Also updated description to: {update_data['nft_description']}")

    except Exception as error:
        print(f"An error occurred while fetching/updating NFT metadata: {error}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    fill_metadata()
