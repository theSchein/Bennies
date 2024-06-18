from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
import logging
from datetime import datetime, timedelta
from helpers.db.connection import connect_db
from psycopg2 import Error
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='.env.local')

# Define the default arguments
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
}

# Define the DAG
dag = DAG(
    'promote_verified_assets',
    default_args=default_args,
    description='A DAG to promote verified publishers, collections, tokens, and NFTs',
    schedule_interval=timedelta(days=1),
    start_date=days_ago(1),
    catchup=False,
)

def promote_publishers():
    conn = connect_db()
    if conn is None:
        return

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT publisher_id FROM transform.publisher
                WHERE promoted = FALSE;
            """)
            publishers = cursor.fetchall()

            for publisher in publishers:
                publisher_id = publisher[0]
                cursor.execute("""
                    INSERT INTO public.publishers (publisher_id, name, description, media_url, contract_address)
                    SELECT publisher_id, name, description, media_url, contract_address
                    FROM transform.publisher
                    WHERE publisher_id = %s
                    ON CONFLICT (contract_address) DO UPDATE SET
                        name = EXCLUDED.name,
                        description = EXCLUDED.description,
                        media_url = EXCLUDED.media_url,
                        updated_at = EXCLUDED.updated_at;
                """, (publisher_id,))
                conn.commit()
                cursor.execute("""
                    UPDATE transform.publisher
                    SET promoted = TRUE
                    WHERE publisher_id = %s;
                """, (publisher_id,))
                conn.commit()
                print(f"Publisher {publisher_id} promoted to public.")
    except (Exception, Error) as error:
        print(f"Error promoting publishers: {error}")
        conn.rollback()
    finally:
        conn.close()

def promote_collections():
    conn = connect_db()
    if conn is None:
        return

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT collection_id FROM transform.collection
                WHERE promoted = FALSE;
            """)
            collections = cursor.fetchall()

            for collection in collections:
                collection_id = collection[0]
                cursor.execute("""
                    INSERT INTO public.collections (collection_id, collection_name, collection_description, media_url, collection_utility, category, num_owners, num_likes, deployer_address, contract_address, token_type, nft_licence, universe_id, publisher_id)
                    SELECT collection_id, collection_name, collection_description, media_url, collection_utility, category, num_owners, num_likes, deployer_address, contract_address, token_type, nft_licence, universe_id, publisher_id
                    FROM transform.collection
                    WHERE collection_id = %s
                    ON CONFLICT (collection_id) DO UPDATE SET
                        collection_name = COALESCE(EXCLUDED.collection_name, public.collections.collection_name),
                        collection_description = COALESCE(EXCLUDED.collection_description, public.collections.collection_description),
                        media_url = COALESCE(EXCLUDED.media_url, public.collections.media_url),
                        collection_utility = COALESCE(EXCLUDED.collection_utility, public.collections.collection_utility),
                        category = COALESCE(EXCLUDED.category, public.collections.category),
                        num_owners = COALESCE(EXCLUDED.num_owners, public.collections.num_owners),
                        num_likes = COALESCE(EXCLUDED.num_likes, public.collections.num_likes),
                        deployer_address = COALESCE(EXCLUDED.deployer_address, public.collections.deployer_address),
                        contract_address = COALESCE(EXCLUDED.contract_address, public.collections.contract_address),
                        token_type = COALESCE(EXCLUDED.token_type, public.collections.token_type),
                        nft_licence = COALESCE(EXCLUDED.nft_licence, public.collections.nft_licence),
                        universe_id = COALESCE(EXCLUDED.universe_id, public.collections.universe_id),
                        publisher_id = COALESCE(EXCLUDED.publisher_id, public.collections.publisher_id);
                """, (collection_id,))
                conn.commit()
                
                cursor.execute("""
                    UPDATE transform.collection
                    SET promoted = TRUE
                    WHERE collection_id = %s;
                """, (collection_id,))
                conn.commit()
                print(f"Collection {collection_id} promoted to public.")
    except (Exception, Error) as error:
        print(f"Error promoting collections: {error}")
        conn.rollback()
    finally:
        conn.close()


def promote_verified_tokens():
    conn = connect_db()
    if conn is None:
        return

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT contract_address FROM transform.verification 
                WHERE verified = TRUE AND token_type = 'ERC20' AND promoted IS FALSE;
            """)
            verified_tokens = cursor.fetchall()

            for token in verified_tokens:
                contract_address = token[0]
                cursor.execute("""
                    INSERT INTO public.tokens (contract_address, token_name, token_symbol, logo_media, creation_date, deployer_address, supply, decimals, token_utility, description, category)
                    SELECT contract_address, token_name, token_symbol, logo_media, creation_date, deployer_address, supply, decimals, token_utility, description, category
                    FROM transform.token
                    WHERE contract_address = %s
                    ON CONFLICT (contract_address) DO UPDATE SET
                        token_name = COALESCE(EXCLUDED.token_name, public.tokens.token_name),
                        token_symbol = COALESCE(EXCLUDED.token_symbol, public.tokens.token_symbol),
                        logo_media = COALESCE(EXCLUDED.logo_media, public.tokens.logo_media),
                        creation_date = COALESCE(EXCLUDED.creation_date, public.tokens.creation_date),
                        deployer_address = COALESCE(EXCLUDED.deployer_address, public.tokens.deployer_address),
                        supply = COALESCE(EXCLUDED.supply, public.tokens.supply),
                        decimals = COALESCE(EXCLUDED.decimals, public.tokens.decimals),
                        token_utility = COALESCE(EXCLUDED.token_utility, public.tokens.token_utility),
                        description = COALESCE(EXCLUDED.description, public.tokens.description),
                        category = COALESCE(EXCLUDED.category, public.tokens.category);
                """, (contract_address,))
                conn.commit()
                cursor.execute("""
                    UPDATE transform.verification
                    SET promoted = TRUE
                    WHERE contract_address = %s;
                """, (contract_address,))
                conn.commit()
                print(f"Token {contract_address} promoted to production.")
    except (Exception, Error) as error:
        print(f"Error promoting tokens: {error}")
        conn.rollback()
    finally:
        conn.close()

def promote_verified_nfts():
    conn = connect_db()
    if conn is None:
        return

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT contract_address FROM transform.verification 
                WHERE verified = TRUE AND token_type = 'ERC721' AND promoted IS FALSE;
            """)
            verified_nfts = cursor.fetchall()

            for nft in verified_nfts:
                contract_address = nft[0]
                cursor.execute("""
                    INSERT INTO public.nfts (contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners, publisher_id)
                    SELECT contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners, publisher_id
                    FROM transform.nft
                    WHERE contract_address = %s
                    ON CONFLICT (contract_address_token_id) DO UPDATE SET
                        token_uri_gateway = COALESCE(EXCLUDED.token_uri_gateway, public.nfts.token_uri_gateway),
                        nft_description = COALESCE(EXCLUDED.nft_description, public.nfts.nft_description),
                        media_url = COALESCE(EXCLUDED.media_url, public.nfts.media_url),
                        nft_sales_link = COALESCE(EXCLUDED.nft_sales_link, public.nfts.nft_sales_link),
                        nft_licence = COALESCE(EXCLUDED.nft_licence, public.nfts.nft_licence),
                        nft_context = COALESCE(EXCLUDED.nft_context, public.nfts.nft_context),
                        nft_utility = COALESCE(EXCLUDED.nft_utility, public.nfts.nft_utility),
                        category = COALESCE(EXCLUDED.category, public.nfts.category),
                        owners = COALESCE(EXCLUDED.owners, public.nfts.owners),
                        publisher_id = COALESCE(EXCLUDED.publisher_id, public.nfts.publisher_id);
                """, (contract_address,))
                conn.commit()
                cursor.execute("""
                    UPDATE transform.verification
                    SET promoted = TRUE
                    WHERE contract_address = %s;
                """, (contract_address,))
                conn.commit()
                print(f"NFT {contract_address} promoted to production.")
    except (Exception, Error) as error:
        print(f"Error promoting NFTs: {error}")
        conn.rollback()
    finally:
        conn.close()

# Define the tasks
promote_publishers_task = PythonOperator(
    task_id='promote_publishers',
    python_callable=promote_publishers,
    dag=dag,
)

promote_collections_task = PythonOperator(
    task_id='promote_collections',
    python_callable=promote_collections,
    dag=dag,
)

promote_verified_tokens_task = PythonOperator(
    task_id='promote_verified_tokens',
    python_callable=promote_verified_tokens,
    dag=dag,
)

promote_verified_nfts_task = PythonOperator(
    task_id='promote_verified_nfts',
    python_callable=promote_verified_nfts,
    dag=dag,
)

# Set task dependencies
promote_publishers_task >> promote_collections_task >> promote_verified_tokens_task >> promote_verified_nfts_task
