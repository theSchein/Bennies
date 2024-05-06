from datetime import datetime, timedelta
import time
import re  

class TwitterVerifier:
    def __init__(self):
        from ntscraper import Nitter
        self.scraper = Nitter()

    def account_is_active(self, twitter_username, retries=3, delay=5):
        print(f"Checking if account {twitter_username} is active...")
        three_months_ago = datetime.now() - timedelta(days=90)
        for attempt in range(retries):
            try:
                tweets = self.scraper.get_tweets(twitter_username, mode='user', number=5)
                if not tweets['tweets']:
                    print("No tweets found. Account might be inactive or private.")
                    continue  # Continue to retry

                found_recent_tweet = False
                for tweet in tweets['tweets']:
                    tweet_date_str = tweet['date']
                    print(f"Original tweet date string: {tweet_date_str}")

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

# Lazy initialization of the TwitterVerifier
verifier = None

def get_verifier():
    global verifier
    if verifier is None:
        verifier = TwitterVerifier()
    return verifier
