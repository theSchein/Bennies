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
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-4 md:p-6 rounded-lg shadow-md max-w-full mx-auto my-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-gray-800">
                User Comment Leaderboard
            </h2>
            <div className="overflow-x-auto bg-white rounded-lg">
                <table className="w-full text-xs md:text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-900">
                                Rank
                            </th>
                            <th className="px-4 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-900">
                                Username
                            </th>
                            <th className="px-4 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-900">
                                Score
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {userLeaderboard.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 md:px-6 md:py-4">
                                    {item.rank}
                                </td>
                                <td className="px-4 py-2 md:px-6 md:py-4">
                                    {item.username}
                                </td>
                                <td className="px-4 py-2 md:px-6 md:py-4">
                                    {item.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserLeaderboard;
