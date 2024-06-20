import React from "react";

const TwitterData = ({ twitter }) => {
    if (!twitter) {
        return null;
    }

    return (
        <div className="bg-light-tertiary dark:bg-dark-tertiary p-6 rounded-lg shadow-lg space-y-6">
            <div className="space-y-4">
                <p className="text-xl text-secondary dark:text-light-quaternary">
                    <span className="font-semibold">Profile:</span> {twitter.twitter_profile}
                </p>
                <p className="text-xl text-secondary dark:text-light-quaternary">
                    <span className="font-semibold">Last Tweet Date:</span> {new Date(twitter.last_tweet_date).toLocaleDateString()}
                </p>
                <p className="text-xl text-secondary dark:text-light-quaternary">
                    <span className="font-semibold">Followers Count:</span> {twitter.followers_count}
                </p>
                <p className="text-xl text-secondary dark:text-light-quaternary">
                    <span className="font-semibold">Tweets in Last 3 Months:</span> {twitter.tweets_last_3_months}
                </p>
                <p className="text-xl text-secondary dark:text-light-quaternary">
                    <span className="font-semibold">Account Age (Days):</span> {twitter.account_age_days}
                </p>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-primary dark:text-light-quaternary mb-2">Last 5 Tweets</h3>
                <ul className="list-disc pl-6 space-y-2 text-secondary dark:text-light-quaternary">
                    {twitter.last_5_tweets.map((tweet, index) => (
                        <li key={index} className="text-lg">{tweet}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TwitterData;
