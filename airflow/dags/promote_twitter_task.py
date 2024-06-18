from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from datetime import timedelta
import os
import psycopg2
from psycopg2 import Error
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env')

DATABASE_URL = os.getenv("POSTGRES_URL")

def get_ids_from_contract_address(contract_address):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT collection_id FROM public.collections WHERE contract_address = %s;
        """, (contract_address,))
        collection_id = cursor.fetchone()
        collection_id = collection_id[0] if collection_id else None

        cursor.execute("""
            SELECT publisher_id FROM public.publishers WHERE contract_address = %s;
        """, (contract_address,))
        publisher_id = cursor.fetchone()
        publisher_id = publisher_id[0] if publisher_id else None

        cursor.execute("""
            SELECT token_id FROM public.tokens WHERE contract_address = %s;
        """, (contract_address,))
        token_id = cursor.fetchone()
        token_id = token_id[0] if token_id else None

        cursor.close()
        conn.close()

        print(f"Fetched IDs for contract address {contract_address}: Collection ID: {collection_id}, Publisher ID: {publisher_id}, Token ID: {token_id}")
        return collection_id, publisher_id, token_id
    except (Exception, Error) as error:
        print("Error fetching IDs from contract address:", error)
        return None, None, None

def verify_and_promote_twitter():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Select unique completed entries from transform.twitter_data that have not been promoted
        cursor.execute("""
            SELECT DISTINCT ON (contract_address) id, collection_id, publisher_id, token_id, contract_address, twitter_profile, last_tweet_date,
                   followers_count, tweets_last_3_months, account_age_days, last_5_tweets
            FROM transform.twitter_data
            WHERE collection_id IS NULL OR publisher_id IS NULL OR token_id IS NULL;
        """)
        twitter_data_entries = cursor.fetchall()

        if not twitter_data_entries:
            print("No entries found in transform.twitter_data.")
        else:
            print(f"Found {len(twitter_data_entries)} entries to process.")

        for entry in twitter_data_entries:
            (id, collection_id, publisher_id, token_id, contract_address, twitter_profile, last_tweet_date,
             followers_count, tweets_last_3_months, account_age_days, last_5_tweets) = entry

            print(f"Processing Twitter data for contract address {contract_address}, Twitter profile {twitter_profile}...")

            # Fetch IDs for collection, publisher, and token if not already present
            if not (collection_id and publisher_id and token_id):
                collection_id, publisher_id, token_id = get_ids_from_contract_address(contract_address)

            # Only proceed if at least one ID is found
            if collection_id or publisher_id or token_id:
                # Check if the entry is already in the verification table
                cursor.execute("""
                    SELECT EXISTS(
                        SELECT 1 FROM transform.verification
                        WHERE contract_address = %s AND twitter_added = TRUE
                    );
                """, (contract_address,))
                exists = cursor.fetchone()[0]

                if not exists:
                    # Insert into prod.twitter_data
                    cursor.execute("""
                        INSERT INTO public.twitters (
                            collection_id, publisher_id, token_id, contract_address, twitter_profile, last_tweet_date,
                            followers_count, tweets_last_3_months, account_age_days, last_5_tweets
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (collection_id, publisher_id, token_id, contract_address, twitter_profile, last_tweet_date,
                          followers_count, tweets_last_3_months, account_age_days, last_5_tweets))

                    # Update the verification table
                    cursor.execute("""
                        UPDATE transform.verification
                        SET twitter_added = TRUE
                        WHERE contract_address = %s
                    """, (contract_address,))

                    conn.commit()
                    print(f"Promoted Twitter data for {twitter_profile} to prod.")
                else:
                    print(f"Twitter data for {twitter_profile} already exists in prod.")
            else:
                print(f"Missing IDs for contract address {contract_address}. Skipping entry.")

        cursor.close()
        conn.close()
    except (Exception, Error) as error:
        print("Error processing and promoting Twitter data:", error)

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'promote_twitter_data',
    default_args=default_args,
    description='A DAG to promote Twitter data to production',
    schedule_interval='@daily',
    start_date=days_ago(1),
    tags=['twitter', 'promotion'],
)

promote_twitter_task = PythonOperator(
    task_id='verify_and_promote_twitter',
    python_callable=verify_and_promote_twitter,
    dag=dag,
)

promote_twitter_task
