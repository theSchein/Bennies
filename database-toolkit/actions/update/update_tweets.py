import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import Error
from utils.nitter import initialize_scraper
from utils.twitterCalls import last_tweet_date, number_of_followers, tweets_last_3_months, account_age
import time

# Load environment variables
load_dotenv(dotenv_path='.env.local')

DATABASE_URL = os.getenv("POSTGRES_URL")

def get_twitter_accounts_from_public():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT contract_address, twitter_profile
            FROM public.twitters;
        """)
        twitter_accounts = cursor.fetchall()
        cursor.close()
        conn.close()
        return twitter_accounts
    except (Exception, Error) as error:
        print("Error fetching twitter accounts from public.twitters:", error)
        return []

def update_twitter_data(contract_address, twitter_profile, last_tweet, followers_count, recent_tweets_count, account_age_days, last_five_tweets):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE public.twitters
            SET last_tweet_date = %s, followers_count = %s, tweets_last_3_months = %s, 
                account_age_days = %s, last_5_tweets = %s
            WHERE contract_address = %s AND twitter_profile = %s;
        """, (last_tweet, followers_count, recent_tweets_count, account_age_days, last_five_tweets, contract_address, twitter_profile))
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Updated Twitter data for {twitter_profile}")
    except (Exception, Error) as error:
        print("Error updating twitter data:", error)

def process_twitter_data(scraper, profile_name, contract_address, retries=3, delay=5):
    attempt = 0
    retries = int(retries)
    while attempt < retries:
        try:
            # Get profile information
            profile_info = scraper.get_profile_info(profile_name)
            if not profile_info:
                print("No profile information found.")
                return False
            
            # Get tweets of the profile
            tweets_data = scraper.get_tweets(profile_name, mode='user')
            if not tweets_data or 'tweets' not in tweets_data:
                print("No tweets found for this profile.")
                return False
            
            tweets = tweets_data.get('tweets', [])
            
            if not tweets:
                print("No tweets found for this profile.")
                return False
            
            # Extract insights
            last_tweet = last_tweet_date(tweets)
            followers_count = number_of_followers(profile_info)
            recent_tweets = tweets_last_3_months(tweets)
            account_age_days = account_age(profile_info['joined'])
            last_five_tweets = [tweet['text'] for tweet in tweets[:5]] if len(tweets) >= 5 else [tweet['text'] for tweet in tweets]

            update_twitter_data(
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

def update_twitter():
    twitter_accounts = get_twitter_accounts_from_public()
    if not twitter_accounts:
        print("No Twitter accounts found in public.twitters.")
        return

    scraper = initialize_scraper(log_level=1, skip_instance_check=False)

    for contract_address, twitter_account in twitter_accounts:
        print(f"Processing Twitter account {twitter_account}...")
        process_twitter_data(scraper, twitter_account, contract_address)

if __name__ == "__main__":
    update_twitter()
