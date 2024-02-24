import React, { useState, useEffect } from "react";

const UserLeaderboard = () => {
    const [userLeaderboard, setUserLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            const response = await fetch("/api/leaderboard/userLeaderboard");
            if (response.ok) {
                const data = await response.json();
                setUserLeaderboard(data.userLeaderboard);
            } else {
                console.error("Failed to fetch leaderboard data");
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
<div className="leaderboard-container max-w-4xl">
    <h2 className="leaderboard-heading">
        Commenter Leaderboard
    </h2>
    <div className="overflow-x-auto">
        <table className="leaderboard-table">
            <thead>
                <tr>
                    <th className="table-header">Rank</th>
                    <th className="table-header">Username</th>
                    <th className="table-header">Score</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {userLeaderboard.map((item, index) => (
                    <tr key={index}>
                        <td className="table-cell">{item.rank}</td>
                        <td className="table-cell">{item.username}</td>
                        <td className="table-cell">{item.score}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>
    );
};

export default UserLeaderboard;
