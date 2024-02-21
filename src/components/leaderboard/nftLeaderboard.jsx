// components/leaderboard/leaderboard.jsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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
<div className="leaderboard-container max-w-4xl">
    <h2 className="leaderboard-heading">
                NFT Leaderboard
            </h2>
            <div className="overflow-x-auto">
            <table className="leaderboard-table">
            <thead>
                        <tr>
                            <th className="table-header">
                                Rank
                            </th>
                            <th className="table-header">
                                NFT Name
                            </th>
                            <th className="table-header">
                                Collection
                            </th>
                            <th className="table-header">
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
                                <td className="table-cell">
                                    {item.ranking}
                                </td>
                                <td className="table-cell">
                                    {item.nft_name}
                                </td>
                                <td className="table-cell">
                                    <Link
                                        href={`/collection/${item.collection_id}/${item.collection_name}`}
                                        passHref
                                        legacyBehavior
                                    >
                                        <a onClick={(e) => e.stopPropagation()}>
                                            {item.collection_name}
                                        </a>
                                    </Link>
                                </td>
                                <td className="table-cell">
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
