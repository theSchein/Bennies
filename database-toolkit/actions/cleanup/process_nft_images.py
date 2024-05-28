import requests
import time
from db.connection import connect_db
from psycopg2.extras import DictCursor
from s3.queries import upload_file_to_s3

def process_nft_images():
    conn = connect_db()
    if not conn:
        print("Failed to connect to the database.")
        return

    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        print("Fetching NFTs with missing media URLs...")
        cursor.execute("""
            SELECT * FROM nfts WHERE media_url NOT LIKE 'https://shuk.nyc3.cdn.digitaloceanspaces.com/%'
        """)
        nfts_to_process = cursor.fetchall()
        print(f"Found {len(nfts_to_process)} NFTs with missing media URLs.")

        processed_count = 0
        max_process_count = 100000  

        for nft in nfts_to_process:
            if processed_count >= max_process_count:
                print(f"Reached the maximum process count of {max_process_count}.")
                break  # Stop processing if the limit is reached

            new_image_url = upload_file_to_s3(nft['media_url'], f"{nft['contract_address']}/{nft['token_id']}", "shuk")
            cursor.execute("""
                UPDATE nfts SET media_url = %s WHERE nft_id = %s
            """, (new_image_url, nft['nft_id']))
            conn.commit()
            print(f"Updated NFT ID {nft['nft_id']} with new media URL: {new_image_url}")
            processed_count += 1

        print(f"Processed {processed_count} NFT images successfully.")
    except Exception as error:
        print(f"Failed to process NFT images: {error}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    process_nft_images()
