// pages/search.js
// This page displays the search results for the query.
// Search is only by name and only for nfts, need more fields to search or tags to improve results

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import Link from "next/link";
import Image from "next/image";
import fallbackImageUrl from "../../public/placeholder.png";

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [data, setData] = useState({ collections: [], nfts: [] });
    const [error, setError] = useState("");

    // Helper function to check if the URL is a data URI
    const isDataUri = (url) => {
        return url.startsWith("data:image/svg+xml;base64,");
    };

    // Helper function to check if the URL is valid (simplified version)
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false; // Not a valid URL
        }
    };

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
                console.log(data.collections);
            } catch (err) {
                setError("An error occurred while fetching the results.");
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="p-10 bg-gradient-light dark:bg-gradient-dark flex flex-col min-h-screen">
            <h1 className="text-light-quaternary dark:text-dark-primary font-subheading text-3xl mb-4">
                {query && `Search Results for: ${query}`}
                {!query && "Search here"}
            </h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <SearchBar />
            <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.collections.map((collection) => (
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
                                            src={
                                                collection.media_url ||
                                                fallbackImageUrl
                                            }
                                            alt={collection.collection_name}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-light-quaternary dark:text-dark-quaternary text-lg font-bold truncate">
                                            {collection.collection_name}
                                        </h3>
                                        <h3 className="text-light-quaternary dark:text-dark-quaternary text-lg font-bold truncate">
                                            {collection.num_collection_items}
                                        </h3>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {data.nfts.map((nft) => (
                        <Link
                            key={nft.nft_id}
                            href={`/nft/${nft.nft_id}/${nft.nft_name}`}
                            passHref
                            legacyBehavior
                        >
                            <a className="block transform transition duration-300 ease-in-out hover:-translate-y-2">
                                <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-2xl h-90 flex flex-col">
                                    <div className="w-full h-80 relative">
                                        {isDataUri(nft.media_url) ||
                                        (nft.media_url &&
                                            isValidUrl(nft.media_url)) ? (
                                            // Use a regular <img> tag for SVG data URIs or valid URLs
                                            <img
                                                src={nft.media_url}
                                                alt={nft.nft_name}
                                                style={{
                                                    objectFit: "cover",
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            />
                                        ) : (
                                            // Fallback image for invalid URLs or when media_url is "Blank"
                                            <Image
                                                src={fallbackImageUrl}
                                                alt="Fallback Image"
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-4 flex-grow">
                                        <h3 className="text-light-quaternary dark:text-dark-quaternary text-lg font-bold truncate">
                                            {nft.nft_name}
                                        </h3>
                                        <p className="text-light-quaternary dark:text-dark-quaternary text-sm mt-1">
                                            Address:{" "}
                                            {nft.contract_address.substring(0, 20)}
                                            ...
                                        </p>
                                        <p className="text-light-quaternary dark:text-dark-quaternary text-sm mt-2 line-clamp-1">
                                            {nft.nft_description}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
