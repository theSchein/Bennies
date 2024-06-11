from db.connection import connect_db
from psycopg2.extras import DictCursor
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from web3 import Web3
from web3.exceptions import InvalidAddress
from s3.queries import upload_file_to_s3

def check_duplicates(contract_address):
    conn = connect_db()
    if conn is None:
        print("Failed to connect to the database.")
        return False

    cursor = conn.cursor(cursor_factory=DictCursor)
    print("Checking for duplicates in the database...")

    try:
        # Check duplicates in NFTs
        cursor.execute("""
            SELECT contract_address_token_id, COUNT(*)
            FROM transform.nft
            WHERE contract_address = %s
            GROUP BY contract_address_token_id
            HAVING COUNT(*) > 1
        """, (contract_address,))
        nft_duplicates = cursor.fetchall()

        # Check duplicates in Collections
        cursor.execute("""
            SELECT contract_address, collection_name, COUNT(*)
            FROM transform.collection
            WHERE contract_address = %s
            GROUP BY contract_address, collection_name
            HAVING COUNT(*) > 1
        """, (contract_address,))
        collection_duplicates = cursor.fetchall()

        return not (nft_duplicates or collection_duplicates)

    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def fill_metadata(contract_address):
    print("Fetching metadata and updating database...")
    conn = connect_db()
    if conn is None:
        print("Failed to connect to the database.")
        return False

    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        cursor.execute("""
            SELECT nft_id, token_uri_gateway
            FROM transform.nft
            WHERE contract_address = %s AND (media_url IS NULL OR media_url = '')
        """, (contract_address,))
        nfts = cursor.fetchall()

        if not nfts:
            print("No NFTs with missing media URLs found.")
            return True

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
                    UPDATE transform.nft
                    SET media_url = %s, nft_name = %s, nft_description = %s
                    WHERE nft_id = %s
                """, (update_data['media_url'], update_data['nft_name'], update_data['nft_description'], nft['nft_id']))
                conn.commit()  # Commit immediately after each successful update
                print(f"Updated NFT ID {nft['nft_id']} with new media URL: {update_data['media_url']}")

        return True

    except Exception as error:
        print(f"An error occurred while fetching/updating NFT metadata: {error}")
        conn.rollback()
        return False
    finally:
        cursor.close()
        conn.close()

def process_nft_images(contract_address, threshold=0.9):
    conn = connect_db()
    if not conn:
        print("Failed to connect to the database.")
        return False

    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        print("Fetching NFTs with missing media URLs...")
        cursor.execute("""
            SELECT * FROM transform.nft WHERE contract_address = %s AND media_url IS NOT NULL AND media_url NOT LIKE 'https://shuk.nyc3.cdn.digitaloceanspaces.com/%%'
        """, (contract_address,))
        nfts_to_process = cursor.fetchall()
        total_nfts = len(nfts_to_process)
        if total_nfts == 0:
            print("No NFTs to process.")
            return True

        print(f"Found {total_nfts} NFTs to process.")

        processed_count = 0
        success_count = 0
        
        for nft in nfts_to_process:
            try:

                print("Processing NFT:", nft)

                media_url = nft.get('media_url', None)
                contract_address = nft.get('contract_address', None)
                token_id = nft.get('token_id', None)
                nft_id = nft.get('nft_id', None)

                if not media_url or not contract_address or not token_id or not nft_id:
                    print(f"Skipping NFT due to missing data: {nft}")
                    continue

                new_image_url = upload_file_to_s3(media_url, f"{contract_address}/{token_id}", "shuk")
                cursor.execute("""
                    UPDATE transform.nft SET media_url = %s WHERE nft_id = %s
                """, (new_image_url, nft_id))
                conn.commit()
                print(f"Updated NFT ID {nft_id} with new media URL: {new_image_url}")
                processed_count += 1
                success_count += 1

            except Exception as e:
                print(f"Error processing NFT {nft['nft_id'] if 'nft_id' in nft else 'unknown'}: {e}")

        print(f"Processed {success_count} out of {total_nfts} NFTs successfully.")
        return success_count / total_nfts >= threshold
    except Exception as error:
        print(f"Failed to process NFT images: {error}")
        conn.rollback()
        return False
    finally:
        cursor.close()
        conn.close()


def verify_checksums(contract_address):
    conn = connect_db()
    if conn is None:
        print("Failed to connect to the database.")
        return False

    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        print("Verifying checksums...")
        cursor.execute("""
            SELECT contract_address, nft_name FROM transform.nft WHERE contract_address = %s
            UNION
            SELECT contract_address, collection_name AS nft_name FROM transform.collection WHERE contract_address = %s
        """, (contract_address, contract_address))
        addresses = cursor.fetchall()

        updates_needed = 0
        for address, name in addresses:
            try:
                new_address = Web3.to_checksum_address(address)
                if address != new_address:
                    updates_needed += 1
                    cursor.execute("""
                        UPDATE transform.nft SET contract_address = %s WHERE contract_address = %s;
                        UPDATE transform.collection SET contract_address = %s WHERE contract_address = %s;
                    """, (new_address, address, new_address, address))
                    conn.commit()
                    print(f"Updated {address} to {new_address}")
            except InvalidAddress:
                print(f"Invalid Ethereum address format detected for {name}: {address}. Address may be too long or contain invalid characters.")

        print(f"Total of {updates_needed} addresses updated.")
        return True
    except Exception as e:
        print(f"An error occurred during checksum verification and update: {e}")
        conn.rollback()
        return False
    finally:
        cursor.close()
        conn.close()

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
