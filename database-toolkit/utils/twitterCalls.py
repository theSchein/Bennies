from datetime import datetime, timedelta

def last_tweet_date(tweets):
    if not tweets:
        return None
    return max(datetime.strptime(tweet['date'], "%b %d, %Y · %I:%M %p UTC") for tweet in tweets if 'date' in tweet)

def number_of_followers(profile):
    return profile.get('stats', {}).get('followers', 0)

def tweets_last_3_months(tweets):
    three_months_ago = datetime.now() - timedelta(days=90)
    return [tweet for tweet in tweets if 'date' in tweet and datetime.strptime(tweet['date'], "%b %d, %Y · %I:%M %p UTC") > three_months_ago]

def account_age(joined_date):
    joined_datetime = datetime.strptime(joined_date, "%I:%M %p - %d %b %Y")
    return (datetime.now() - joined_datetime).days
