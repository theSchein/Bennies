import React from "react";

const TwitterData = ({ twitter }) => {
    if (!twitter) {
        return null;
    }

    const calculateAccountAge = (days) => {
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const remainingDays = days % 30;

        return `${years > 0 ? `${years} year${years > 1 ? 's' : ''} ` : ''}${
            months > 0 ? `${months} month${months > 1 ? 's' : ''} ` : ''
        }${remainingDays > 0 ? `${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
    };

    return (
        <div className="bg-light-tertiary dark:bg-dark-tertiary p-6 rounded-lg shadow-lg space-y-6">
            <div className="space-y-4 text-center">
                <p className="text-2xl font-heading text-secondary dark:text-dark-font">
                    <a
                        href={`https://twitter.com/${twitter.twitter_profile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:underline"
                    >
                        {twitter.twitter_profile}
                    </a>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-xl text-secondary dark:text-dark-font">
                        <span className="font-semibold">Last Tweet Date:</span>{" "}
                        {new Date(twitter.last_tweet_date).toLocaleDateString()}
                    </p>
                    <p className="text-xl text-secondary dark:text-dark-font">
                        <span className="font-semibold">Followers Count:</span>{" "}
                        {twitter.followers_count.toLocaleString()}
                    </p>
                    <p className="text-xl text-secondary dark:text-dark-font">
                        <span className="font-semibold">Tweets in Last 3 Months:</span>{" "}
                        {twitter.tweets_last_3_months}
                    </p>
                    <p className="text-xl text-secondary dark:text-dark-font">
                        <span className="font-semibold">Account Age:</span>{" "}
                        {calculateAccountAge(twitter.account_age_days)}
                    </p>
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-primary dark:text-dark-font mb-4">
                    Last 5 Tweets
                </h3>
                <div className="grid gap-4">
                    {twitter.last_5_tweets.map((tweet, index) => (
                        <div
                            key={index}
                            className="p-4 bg-light-secondary dark:bg-dark-secondary rounded-lg shadow"
                        >
                            <p className="text-lg text-secondary dark:text-dark-font">{tweet}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TwitterData;
