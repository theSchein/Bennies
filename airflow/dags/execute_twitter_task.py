from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from datetime import timedelta
import sys
import os
import psycopg2
from psycopg2 import Error
from helpers.nitter import initialize_scraper
from helpers.twitterCalls import last_tweet_date, number_of_followers, tweets_last_3_months, account_age
import time


# Load environment variables
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')

DATABASE_URL = os.getenv("POSTGRES_URL")

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'twitter_data_pipeline',
    default_args=default_args,
    description='A DAG to fetch and process Twitter data',
    schedule_interval='30 * * * *',
    start_date=days_ago(1),
    tags=['twitter', 'data_pipeline'],
)

def get_twitter_accounts_from_staging():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT contract_address, twitter_account
            FROM staging.staging_data
            WHERE twitter_account IS NOT NULL AND twitter_added IS NULL;
        """)
        twitter_accounts = cursor.fetchall()
        cursor.close()
        conn.close()
        return twitter_accounts
    except (Exception, Error) as error:
        print("Error fetching twitter accounts from staging:", error)
        return []

def insert_twitter_data(contract_address, twitter_profile, last_tweet, followers_count, recent_tweets_count, account_age_days, last_five_tweets):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO transform.twitter_data (
                contract_address, twitter_profile, last_tweet_date, followers_count,
                tweets_last_3_months, account_age_days, last_5_tweets
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (contract_address, twitter_profile, last_tweet, followers_count, recent_tweets_count, account_age_days, last_five_tweets))
        conn.commit()
        cursor.close()
        conn.close()
    except (Exception, Error) as error:
        print("Error inserting twitter data:", error)

def update_staging_twitter_added(contract_address):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE staging.staging_data
            SET twitter_added = TRUE
            WHERE contract_address = %s
        """, (contract_address,))
        conn.commit()
        cursor.close()
        conn.close()
    except (Exception, Error) as error:
        print("Error updating staging data:", error)

def process_twitter_data(scraper, profile_name, contract_address, retries=3, delay=5):
    attempt = 0
    while attempt < retries:
        try:
            # Get profile information
            profile_info = scraper.get_profile_info(profile_name)
            
            # Get tweets of the profile
            tweets_data = scraper.get_tweets(profile_name, mode='user')
            
            # Ensure 'tweets' is in the expected format
            tweets = tweets_data.get('tweets', [])
            
            if not tweets:
                print("No tweets found for this profile.")
                return False
            
            # Extract insights
            last_tweet = last_tweet_date(tweets)
            followers_count = number_of_followers(profile_info)
            recent_tweets = tweets_last_3_months(tweets)
            account_age_days = account_age(profile_info['joined'])
            last_five_tweets = [tweet['text'] for tweet in tweets[:5]]
            
            insert_twitter_data(
                contract_address,
                profile_name,
                last_tweet,
                followers_count,
                len(recent_tweets),
                account_age_days,
                last_five_tweets
            )
            return True
        except Exception as e:
            print(f"Attempt {attempt + 1} failed with error: {e}")
            attempt += 1
            if attempt < retries:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print(f"All {retries} attempts failed. Skipping {profile_name}.")
                return False

def execute_twitter():
    twitter_accounts = get_twitter_accounts_from_staging()
    if not twitter_accounts:
        print("No Twitter accounts found in staging data.")
        return

    scraper = initialize_scraper(log_level=1, skip_instance_check=False)

    for contract_address, twitter_account in twitter_accounts:
        print(f"Processing Twitter account {twitter_account}...")
        if process_twitter_data(scraper, twitter_account, contract_address):
            update_staging_twitter_added(contract_address)

def run_execute_twitter():
    execute_twitter()

run_twitter_task = PythonOperator(
    task_id='run_execute_twitter',
    python_callable=run_execute_twitter,
    dag=dag,
)

run_twitter_task
