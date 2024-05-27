import { useState } from "react";
import { useSession } from "next-auth/react";
import retry from "async-retry";

const RegisterNftButton = ({ onNftsFetched }) => {
    const [ownedNfts, setOwnedNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();

    const fetchWalletAddresses = async () => {
        try {
            const response = await fetch(`/api/wallet/fetchWallets`);
            if (!response.ok) {
                throw new Error("Failed to fetch wallet addresses");
            }
            const addresses = await response.json();
            await fetchNFTsForAllAddresses(addresses);
        } catch (error) {
            console.error("Error fetching wallet addresses:", error);
            setError("Failed to fetch wallet addresses");
        }
    };

    const fetchNFTsForAddress = async (address) => {
        const url = `/api/user_profile/nfts?address=${address}`;

        return retry(
            async (bail, attempt) => {
                const response = await fetch(url);
                const json = await response.json();

                if (response.ok) {
                    return json;
                } else if (json.error && json.error.code === 429) {
                    console.error(
                        `Attempt ${attempt}: HTTP error 429: Too Many Requests, retrying...`,
                    );
                    throw new Error("HTTP error 429: Too Many Requests");
                } else {
                    bail(
                        new Error(`HTTP error ${response.status}: ${json.message}`),
                    );
                }
            },
            {
                retries: 5,
                factor: 2,
                minTimeout: 1000,
                maxTimeout: 60000,
                onRetry: (error, attempt) => {
                    console.log(
                        `Retry attempt ${attempt} after error: ${error.message}`,
                    );
                },
            },
        );
    };

    const fetchNFTsForAllAddresses = async (addresses) => {
        setLoading(true);
        setError("");
        try {
            const allOwnedNFTs = await Promise.all(
                addresses.map(({ wallet_address }) =>
                    fetchNFTsForAddress(wallet_address),
                ),
            );
            setOwnedNfts(allOwnedNFTs.flat());
            onNftsFetched(allOwnedNFTs.flat());  // Call the callback function with the fetched NFTs
            registerUserNFTs(allOwnedNFTs.flat());  // Register user NFTs
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const registerUserNFTs = async (nfts) => {
        try {
            const response = await fetch('/api/user_profile/registerNfts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nfts }),
            });

            if (response.ok) {
                alert('NFTs registered successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registering NFTs failed');
            }
        } catch (error) {
            console.error("Failed to register NFTs:", error);
            setError('Failed to register NFTs');
        }
    };

    const handleButtonClick = () => {
        if (session) {
            fetchWalletAddresses();
        }
    };

    return (
        <div>
            <button
                onClick={handleButtonClick}
                className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
                Register NFTs
            </button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default RegisterNftButton;
