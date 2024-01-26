// hooks/useWalletNFTs.js
// logic for rendering NFTs on the profile page


import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import retry from 'async-retry'

const useWalletNFTs = () => {
    const [ownedNfts, setOwnedNfts] = useState([]);
    const [deployedNfts, setDeployedNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const prevSessionRef = useRef();


    useEffect(() => {
        if (session && session !== prevSessionRef.current) {
            fetchNFTsForAllAddresses(session.wallets);
            prevSessionRef.current = session;
        }
    }, [session]);


    const fetchNFTsForAddress = async (address) => {
        const url = `/api/user_profile/nfts?address=${address}`;
      
        return retry(
          async (bail, attempt) => {
            const response = await fetch(url);
            const json = await response.json();
      
            if (response.ok) {
              return json;
            } else if (json.error && json.error.code === 429) {
              console.error(`Attempt ${attempt}: HTTP error 429: Too Many Requests, retrying...`);
              throw new Error("HTTP error 429: Too Many Requests");
            } else {
              bail(new Error(`HTTP error ${response.status}: ${json.message}`));
            }
          },
          {
            retries: 5,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 60000,
            onRetry: (error, attempt) => {
              console.log(`Retry attempt ${attempt} after error: ${error.message}`);
            },
          }
        );
      };

    const fetchDeployedNFTs = async (address) => {
        try {
            const response = await fetch(
                `/api/user_profile/deployedNfts?address=${address}`,
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const fetchNFTsForAllAddresses = async (addresses) => {
        setLoading(true);
        setError("");
        try {
            const allOwnedNFTs = await Promise.all(
                addresses.map((address) => fetchNFTsForAddress(address)),
            );
            const allDeployedNFTs = await Promise.all(
                addresses.map((address) => fetchDeployedNFTs(address)),
            );
            setOwnedNfts(allOwnedNFTs.flat());
            setDeployedNfts(allDeployedNFTs.flat());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { ownedNfts, deployedNfts, loading, error };
};

export default useWalletNFTs;