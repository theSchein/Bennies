import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import Link from "next/link";
import Image from "next/image";
import fallbackImageUrl from '../../public/placeholder.png'; 


const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [data, setData] = useState({ nfts: [], artists: [] });
    const [error, setError] = useState("");


    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            try {
                const response = await fetch(
                    `/api/search?query=${encodeURIComponent(query)}`,
                );
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError("An error occurred while fetching the results.");
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="p-4 bg-primary">
            <h1 className="text-quaternary font-heading text-3xl mb-4">
                Search Results for: {query}
            </h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <SearchBar />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {data.nfts.map((nft) => (
                    <Link
                        key={nft.nft_id}
                        href={`/nft/${nft.nft_id}/${nft.nft_name}`}
                        passHref
                        legacyBehavior
                    >
                        <a className="block transform transition duration-300 ease-in-out hover:-translate-y-2">
                            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl">
                                <div className="w-full h-80 relative">
                                    {nft.media_url ? (
                                        <Image
                                            src={nft.media_url}
                                            alt={nft.nft_name}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    ) : (
                                        <Image
                                            src={fallbackImageUrl}
                                            alt="Fallback Image"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-gray-900 font-semibold text-lg truncate">
                                        {nft.nft_name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Contract:{" "}
                                        {nft.contract_address.substring(0, 20)}...
                                    </p>
                                    <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                                        {nft.nft_description}
                                    </p>
                                </div>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>

            {/* <h2 className="text-quaternary font-heading text-2xl mb-4 mt-6">
                Artists
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data.artists.map((artist) => (
                    <Link
                        key={artist.artist_id}
                        href={`/artist/${artist.artist_id}/${artist.artist_name}`}
                    >
                        <div className="block p-4 bg-secondary rounded shadow hover:shadow-lg transition-shadow duration-300">
                            <img
                                src={artist.image_url} // Replace with your image property
                                alt={artist.artist_name}
                                className="w-full h-64 object-cover rounded-t"
                            />
                            <div className="p-4">
                                <h3 className="text-quaternary font-heading text-xl mb-2">
                                    {artist.artist_name}
                                </h3>
                                <p className="text-quaternary">
                                    Description: {artist.nft_description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div> */}
        </div>
    );
};

export default Search;
