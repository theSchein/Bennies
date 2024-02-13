import React, { useState, useEffect } from 'react';

const NewsFeed = ({ collectionIds, viewingGroup }) => {
    const [newsItems, setNewsItems] = useState([]);

    useEffect(() => {
        const fetchNewsItems = async () => {
            try {
                let aggregatedNewsItems = [];
                for (const collectionId of collectionIds) {
                    const response = await fetch(`/api/news/fetchNews?collection_id=${collectionId}`);
                    if (!response.ok) throw new Error(`Failed to fetch news items for collection ${collectionId}`);
                    const data = await response.json();
                    aggregatedNewsItems = aggregatedNewsItems.concat(data);
                }
                // Sort aggregated news items by date
                aggregatedNewsItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setNewsItems(aggregatedNewsItems);
            } catch (error) {
                console.error('Error fetching news items:', error);
            }
        };

        if (collectionIds.length) {
            fetchNewsItems();
        }
    }, [collectionIds]);

    const filteredNewsItems = newsItems.filter(item => {
        if (viewingGroup === 'collectors') return true; // Owners see all news
        if (viewingGroup === 'holders' && item.viewing_group !== 'collectors') return true; // Collectors see collector and public news
        return item.viewing_group === 'public'; // Public users see only public news
    });

    return (
        <div className="news-feed mt-8">
            <h2 className="text-2xl font-bold mb-4">News Feed</h2>
            {newsItems.length > 0 ? (
                <ul className="space-y-4">
                    {filteredNewsItems.map((item, index) => (
                        <li key={index} className={`p-4 rounded-lg shadow ${item.viewing_group === 'holders' ? 'bg-blue-200' : item.viewing_group === 'collectors' ? 'bg-green-200' : 'bg-gray-200'}`}>
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <p className="mt-2">{item.content}</p>
                            <small className="text-gray-600">Posted on: {new Date(item.created_at).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No news items to display.</p>
            )}
        </div>
    );
};

export default NewsFeed;
