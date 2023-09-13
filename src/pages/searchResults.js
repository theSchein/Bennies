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
        <div>
            <h1>Search: {query}</h1>
            {error && <div>Error: {error}</div>}
            <h2>NFTs</h2>
            {data.nfts.map((nft) => (
                <Link href={`/nft/${nft.nft_id}/${nft.nft_name}`}>
                    <div key={nft.nft_id}>
                        <h3>{nft.nft_name}</h3>
                        <p>Contract Address: {nft.contract_address}</p>
                        <p>Deployer Address: {nft.deployer_address}</p>
                        <p>Description: {nft.nft_description}</p>
                    </div>
                </Link>
            ))}
            <h2>Artists</h2>
            {data.artists.map((artists) => (
                <Link href={`/artist/${artists.artist_id}/${artists.artist_name}`}>
                    <div key={artists.artist_id}>
                        <h3>{artists.artist_name}</h3>
                        <p>Description: {artists.nft_description}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SearchResults;
