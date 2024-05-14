// pages/search.js
// This page displays the search results for the query.
// Search is only by name and only for nfts, need more fields to search or tags to improve results

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import Link from "next/link";
import Image from "next/image";
import { getImageSource } from "@/components/utils/getImageSource";
import fallbackImageUrl from "../../public/placeholder.png";
import Likes from "@/components/likes/likes";
import CommentIcon from "@mui/icons-material/Comment";

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [data, setData] = useState({ collections: [], nfts: [] });
    const [error, setError] = useState("");

    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            try {
                const response = await fetch(
                    `/api/search/search?query=${encodeURIComponent(query)}`,
                );
                const result = await response.json();
                setData({
                    collections: result.collections.results || [],
                    nfts: result.nfts || [],
                });
            } catch (err) {
                setError("An error occurred while fetching the results.");
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="p-10 bg-gradient-light dark:bg-gradient-dark flex flex-col min-h-screen">
            <h1 className="text-light-font dark:text-dark-primary font-subheading text-3xl mb-4">
                {query && `Search Results for: ${query}`}
                {!query && "Search for NFTs by name"}
            </h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <SearchBar />
            <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.collections.map((collection) => {
                        const imageSource = getImageSource(
                            collection.media_url,
                            fallbackImageUrl,
                        );
                        return (
                            <Link
                                key={collection.collection_id}
                                href={`/collection/${collection.collection_id}`}
                                passHref
                                legacyBehavior
                            >
                                <a className="block transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-2xl h-90 flex flex-col">
                                        <div className="w-full h-80 relative">
                                            <Image
                                                src={imageSource}
                                                alt={collection.collection_name}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-light-quaternary dark:text-dark-quaternary text-lg font-bold truncate">
                                                {collection.collection_name}
                                            </h3>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        );
                    })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {data.nfts.map((nft) => {
                        const imageSource = getImageSource(
                            nft.media_url,
                            fallbackImageUrl,
                        );

                        return (
                            <Link
                                key={nft.nft_id}
                                href={`/nft/${nft.nft_id}/${nft.nft_name}`}
                                passHref
                                legacyBehavior
                            >
                                <a className="block transform transition duration-300 ease-in-out hover:-translate-y-2">
                                    <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-2xl flex flex-col">
                                        <div className="w-full h-80 relative">
                                            <Image
                                                src={imageSource}
                                                alt={nft.nft_name}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div className="p-4 flex-grow flex justify-between">
                                            <div>
                                                <h3 className="text-light-quaternary dark:text-dark-quaternary text-lg font-bold truncate">
                                                    {nft.nft_name}
                                                </h3>
                                                <p className="text-light-quaternary dark:text-dark-quaternary text-sm mt-1 italic">
                                                    {nft.collection_name}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end ">
                                                <div className="flex items-center">
                                                    <Likes />
                                                </div>
                                                <div className="flex items-center mt-2">
                                                    <CommentIcon color="inherit" />
                                                    <span className="mr-2 text-light-quaternary dark:text-dark-quaternary">
                                                        {nft.comment_count}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Search;
