# query_nfts.py
import os
import psycopg2
from psycopg2 import sql
from psycopg2.extras import DictCursor
from dotenv import load_dotenv

# Load environment variables from .env.local file
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
    print("Connection successful")
    return conn

def query_nfts(conn):
    """Query the NFTs table and check for NFTs with missing media_url, grouped by collection name."""
    try:
        cur = conn.cursor(cursor_factory=DictCursor)
        # Adjust the query to join with the collections table and group by collection name
        cur.execute("""
            SELECT c.collection_name, COUNT(n.nft_id) as missing_media_count
            FROM nfts n
            JOIN collections c ON n.collection_id = c.collection_id
            WHERE n.media_url IS NULL OR n.media_url = ''
            GROUP BY c.collection_name
            ORDER BY missing_media_count DESC
        """)
        rows = cur.fetchall()

        if rows:
            print("Missing media URLs by collection:")
            for row in rows:
                print(f"{row['collection_name']}: {row['missing_media_count']}")
        else:
            print("No missing media URLs found.")

        cur.close()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

def main():
    conn = connect_db()
    if conn is not None:
        query_nfts(conn)
        conn.close()

if __name__ == '__main__':
    main()
