# myNitta.py
from pprint import pprint
from nitter import initialize_scraper
from twitterCalls import last_tweet_date, number_of_followers, tweets_last_3_months, account_age

def main(profile_name):
    scraper = initialize_scraper(log_level=1, skip_instance_check=False)
    
    # Get profile information
    profile_info = scraper.get_profile_info(profile_name)
    pprint(profile_info)
    
    # Get tweets of the profile
    tweets_data = scraper.get_tweets(profile_name, mode='user')
    pprint(tweets_data)
    
    # Ensure 'tweets' is in the expected format
    tweets = tweets_data.get('tweets', [])
    
    if not tweets:
        print("No tweets found for this profile.")
        return

    # Extract insights
    last_tweet = last_tweet_date(tweets)
    followers_count = number_of_followers(profile_info)
    recent_tweets = tweets_last_3_months(tweets)
    account_age_days = account_age(profile_info['joined'])
    
    print("\nExtracted Insights:")
    print(f"Last Tweet Date: {last_tweet}")
    print(f"Number of Followers: {followers_count}")
    print(f"Tweets in Last 3 Months: {len(recent_tweets)}")
    print(f"Account Age (days): {account_age_days}")

if __name__ == "__main__":
    profile_name = input("Enter the Twitter profile name: ")
    main(profile_name)
