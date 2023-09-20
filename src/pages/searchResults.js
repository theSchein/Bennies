import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SearchResults = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [data, setData] = useState({ nfts: [], artists: [] });

    const [error, setError] = useState("");

    useEffect(() => {
        // Make sure you have a query before fetching
        if (!query) return;

        const fetchResults = async () => {
            try {
                const response = await fetch(
                    `/api/search?query=${encodeURIComponent(query)}`,
                );
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError("failed response");
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="p-4 bg-primary">
            <h1 className="text-quaternary font-heading text-3xl mb-4">
                Search: {query}
            </h1>
            {error && <div className="text-red-500 mb-4">Error: {error}</div>}
            <h2 className="text-quaternary font-heading text-2xl mb-4">NFTs</h2>
            {data.nfts.map((nft) => (
                <Link
                    key={nft.nft_id}
                    href={`/nft/${nft.nft_id}/${nft.nft_name}`}
                    className="block mb-4 p-4 bg-secondary rounded shadow hover:shadow-lg transition-shadow duration-300"
                >
                    <h3 className="text-quaternary font-heading text-xl mb-2">
                        {nft.nft_name}
                    </h3>
                    <p className="text-quaternary mb-1">
                        Contract Address: {nft.contract_address}
                    </p>
                    <p className="text-quaternary mb-1">
                        Deployer Address: {nft.deployer_address}
                    </p>
                    <p className="text-quaternary">
                        Description: {nft.nft_description}
                    </p>
                </Link>
            ))}
            <h2 className="text-quaternary font-heading text-2xl mb-4 mt-6">
                Artists
            </h2>
            {data.artists.map((artist) => (
                <Link
                    key={artist.artist_id}
                    href={`/artist/${artist.artist_id}/${artist.artist_name}`}
                    className="block mb-4 p-4 bg-secondary rounded shadow hover:shadow-lg transition-shadow duration-300"
                >
                    <h3 className="text-quaternary font-heading text-xl mb-2">
                        {artist.artist_name}
                    </h3>
                    <p className="text-quaternary">
                        Description: {artist.nft_description}
                    </p>
                </Link>
            ))}
        </div>
    );
};

export default SearchResults;
