import React, { useState, useEffect } from 'react';

const NewsFeed = ({ collectionId }) => {
    const [newsItems, setNewsItems] = useState([]);

    useEffect(() => {
        const fetchNewsItems = async () => {
            try {
                const response = await fetch(`/api/news/fetchNews?collection_id=${collectionId}`);
                if (!response.ok) throw new Error('Failed to fetch news items');
                const data = await response.json();
                setNewsItems(data);
            } catch (error) {
                console.error('Error fetching news items:', error);
            }
        };

        fetchNewsItems();
    }, [collectionId]);

    return (
        <div className="news-feed">
            <h2>News Feed</h2>
            {newsItems.length > 0 ? (
                <ul>
                    {newsItems.map((item) => (
                        <li key={item.id}>
                            <h3>{item.title}</h3>
                            <p>{item.content}</p>
                            <small>Posted on: {new Date(item.created_at).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No news items to display.</p>
            )}
        </div>
    );
};

export default NewsFeed;
