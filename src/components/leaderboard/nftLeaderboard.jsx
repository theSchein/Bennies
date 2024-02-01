// components/leaderboard/leaderboard.jsx

import React, { useState, useEffect } from 'react';

const NftLeaderboard = () => {
    const [nftLeaderboard, setNftLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            const response = await fetch('/api/leaderboard/nftLeaderboard');
            if (response.ok) {
                const data = await response.json();
                setNftLeaderboard(data.nftLeaderboard);
            } else {
                console.error('Failed to fetch leaderboard data');
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
        <div>
            <h2>NFT Leaderboard</h2>
            {/* Render NFT leaderboard */}
            <ul>
                {nftLeaderboard.map((item, index) => (
                    <li key={index}>
                        Rank: {item.ranking}, {item.nft_name} in {item.collection_name} - Score: {item.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NftLeaderboard;
