import React, { useState, useEffect } from 'react';

const UserLeaderboard = () => {
    const [userLeaderboard, setUserLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            const response = await fetch('/api/leaderboard/userLeaderboard');
            if (response.ok) {
                const data = await response.json();
                setUserLeaderboard(data.userLeaderboard);
                console.log(userLeaderboard);
            } else {
                console.error('Failed to fetch leaderboard data');
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
        <div>

            <h2>User Comment Leaderboard</h2>
            {/* Render User Comment leaderboard */}
            <ul>
                {userLeaderboard.map((item, index) => (
                    <li key={index}>{item.rank}, {item.username}, {item.score}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserLeaderboard;
