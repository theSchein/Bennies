// components/leaderboard/leaderboard.jsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const NftLeaderboard = () => {
    const [nftLeaderboard, setNftLeaderboard] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            const response = await fetch("/api/leaderboard/nftLeaderboard");
            if (response.ok) {
                const data = await response.json();
                setNftLeaderboard(data.nftLeaderboard);
            } else {
                console.error("Failed to fetch leaderboard data");
            }
        };

        fetchLeaderboardData();
    }, []);

    const handleRowClick = (nftId, nftName) => {
        router.push(`/nft/${nftId}/${nftName}`);
    };

    return (
        <div className="bg-gradient-to-r from-green-100 to-green-300 p-4 md:p-6 rounded-lg shadow-md max-w-full mx-auto my-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-gray-800">
                NFT Leaderboard
            </h2>
            <div className="overflow-x-auto bg-white rounded-lg">
                <table className="w-full text-xs md:text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-900">
                                Rank
                            </th>
                            <th className="px-4 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-900">
                                NFT Name
                            </th>
                            <th className="hidden md:table-cell px-4 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-900">
                                Collection
                            </th>
                            <th className="px-4 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-900">
                                Score
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {nftLeaderboard.map((item, index) => (
                            <tr
                                key={index}
                                onClick={() =>
                                    handleRowClick(item.nft_id, item.nft_name)
                                }
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td className="px-4 py-2 md:px-6 md:py-4">
                                    {item.ranking}
                                </td>
                                <td className="px-4 py-2 md:px-6 md:py-4">
                                    {item.nft_name}
                                </td>
                                <td className="hidden md:table-cell px-4 py-2 md:px-6 md:py-4">
                                    {item.collection_name}
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

export default NftLeaderboard;
