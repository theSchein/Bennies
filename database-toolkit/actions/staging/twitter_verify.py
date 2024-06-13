from datetime import datetime, timedelta
import time
import re
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv(dotenv_path='.env.local')

class Nitter:
    def __init__(self, instance_url, username=None, password=None):
        self.instance_url = instance_url
        self.auth = HTTPBasicAuth(username, password) if username and password else None

    def get_tweets(self, twitter_username, mode='user', number=5):
        url = f"{self.instance_url}/{twitter_username}"
        params = {'n': number}
        response = requests.get(url, params=params, auth=self.auth)
        response.raise_for_status()
        return self._parse_response(response)

    def profile(self, twitter_username):
        url = f"{self.instance_url}/{twitter_username}/profile"
        response = requests.get(url, auth=self.auth)
        response.raise_for_status()
        return self._parse_response(response)

    def user_tweets(self, twitter_username, page=1):
        url = f"{self.instance_url}/{twitter_username}/tweets?page={page}"
        response = requests.get(url, auth=self.auth)
        response.raise_for_status()
        return self._parse_response(response)
    
    def _parse_response(self, response):
        if response.headers['Content-Type'] == 'application/json':
            return response.json()
        else:
            print(f"Unexpected content type: {response.headers['Content-Type']}")
            print(f"Response content: {response.content.decode('utf-8')}")
            return {}

class TwitterVerifier:
    def __init__(self, instance_url, username=None, password=None):
        self.scraper = Nitter(instance_url, username=username, password=password)

    def account_is_active(self, twitter_username, retries=3, delay=5):
        print(f"Checking if account {twitter_username} is active...")
        three_months_ago = datetime.now() - timedelta(days=90)
        for attempt in range(retries):
            try:
                print(f"Attempt {attempt + 1}: Fetching tweets for {twitter_username}")
                tweets = self.scraper.get_tweets(twitter_username, mode='user', number=5)
                print(f"Tweets fetched: {tweets}")
                if not tweets.get('tweets'):
                    print("No tweets found. Account might be inactive or private.")
                    continue  # Continue to retry

                found_recent_tweet = False
                for tweet in tweets['tweets']:
                    tweet_date_str = tweet['date']
                    #print(f"Original tweet date string: {tweet_date_str}")

                    # Clean up the date string
                    cleaned_date_str = re.sub(r" ·", "", tweet_date_str)
                    print(f"Cleaned tweet date string: {cleaned_date_str}")

                    # Parse the date
                    try:
                        tweet_date = datetime.strptime(cleaned_date_str, "%b %d, %Y %I:%M %p %Z")
                        print(f"Found tweet on {tweet_date}")
                        if tweet_date > three_months_ago:
                            return True  # Found a recent tweet
                    except ValueError as e:
                        print(f"Error parsing date: {e}")

                if not found_recent_tweet:
                    print("No recent tweets found in this attempt.")
                    if attempt < retries - 1:
                        print(f"Retrying in {delay} seconds...")
                        time.sleep(delay)
            except Exception as e:
                print(f"Attempt {attempt + 1} failed: {e}")
                if attempt < retries - 1:
                    print(f"Retrying in {delay} seconds...")
                    time.sleep(delay)

        print("All attempts failed, assuming account is inactive.")
        return False

    def get_twitter_data(self, twitter_username):
        try:
            # Fetch profile data
            print(f"Fetching profile for {twitter_username}")
            profile = self.scraper.profile(twitter_username)
            print(f"Profile fetched: {profile}")
            number_of_followers = profile['followers_count']
            number_of_tweets = profile['statuses_count']

            # Fetch tweets
            three_years_ago = datetime.now() - timedelta(days=3*365)
            all_tweets = []
            last_tweet_activity = None

            page = 1
            while True:
                print(f"Fetching tweets for {twitter_username}, page {page}")
                tweets = self.scraper.user_tweets(twitter_username, page=page)
                # print(f"Fetched tweets: {tweets}")
                if not tweets:
                    break

                for tweet in tweets:
                    tweet_date = datetime.strptime(tweet['date'], "%Y-%m-%dT%H:%M:%S.%fZ")
                    if tweet_date < three_years_ago:
                        break

                    all_tweets.append(tweet)
                    if last_tweet_activity is None or tweet_date > last_tweet_activity:
                        last_tweet_activity = tweet_date

                page += 1

            return {
                "last_tweet_activity": last_tweet_activity,
                "last_three_years_tweets": [tweet['text'] for tweet in all_tweets],
                "number_of_followers": number_of_followers,
                "number_of_tweets": number_of_tweets
            }
        except Exception as e:
            print(f"Error fetching data for {twitter_username}: {e}")
            return None

# Lazy initialization of the TwitterVerifier
verifier = None

def get_verifier(instance_url, username=None, password=None):
    global verifier
    if verifier is None:
        verifier = TwitterVerifier(instance_url, username=username, password=password)
    return verifier

if __name__ == "__main__":
    instance_url = os.getenv("NITTER_INSTANCE_URL")
    username = os.getenv("NITTER_USERNAME")
    password = os.getenv("NITTER_PASSWORD")
    
    verifier = get_verifier(instance_url, username=username, password=password)
    
    twitter_username = "BoredApeYC"  # Replace with the Twitter handle you want to check
    if verifier.account_is_active(twitter_username):
        twitter_data = verifier.get_twitter_data(twitter_username)
        if twitter_data:
            print("Twitter Data:")
            print(f"Last Activity Date: {twitter_data['last_tweet_activity']}")
            print(f"Number of Followers: {twitter_data['number_of_followers']}")
            print(f"Number of Tweets: {twitter_data['number_of_tweets']}")
            print(f"Last 3 Years Tweets: {twitter_data['last_three_years_tweets']}")
    else:
        print(f"Account {twitter_username} is inactive.")
