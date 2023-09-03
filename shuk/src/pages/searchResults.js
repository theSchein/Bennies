import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'


const SearchResults = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');

    const [data, setData] = useState({ nfts: [], artists: [] });

    const [error, setError] = useState('');

    useEffect(() => {
        // Make sure you have a query before fetching
        if (!query) return;

        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError('failed response');
            }
        };

        console.log('fetching results', data);

        fetchResults();
    }, [query]);


    return (
        <div>
            <h1>Search: {query}</h1>
            {error && <div>Error: {error}</div>}
            <h2>NFTs</h2>
            {data.nfts.map((nft) => (
                <div key={nft.nft_id}>
                    <h3>{nft.nft_name}</h3>
                    <p>Contract Address: {nft.contract_address}</p>
                    <p>Deployer Address: {nft.deployer_address}</p>
                    <p>Description: {nft.nft_description}</p>
                </div>
            ))}
        </div>
    );}

export default SearchResults;
