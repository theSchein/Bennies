import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

function WalletNFTs() {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { data: session } = useSession();

    useEffect(() => {
        fetchWalletAddresses();
    }, []);

    const fetchWalletAddresses = async () => {
        try {
            const response = await fetch('/api/wallet/fetchWallets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const walletData = await response.json();
            const addresses = walletData.map(wallet => wallet.wallet_address);
            fetchNFTsForAllAddresses(addresses);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const fetchNFTsForAddress = async (address) => {
        try {
            const response = await fetch(`/api/user_profile/nfts?address=${address}`);
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
        setError('');
        try {
            const allNFTs = await Promise.all(addresses.map(address => fetchNFTsForAddress(address)));
            setNfts(allNFTs.flat());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div>
                {nfts.map((nft, index) => (
                    <div key={index}>
                        {/* Display your NFT data here */}
                        <p>{nft.contract_address_token_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WalletNFTs;
