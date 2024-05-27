// components/user_profile/RegisterNftButton.jsx
import { useState } from "react";
import { useSession } from "next-auth/react";
import retry from "async-retry";
import AlertModal from "../alert";

const RegisterNftButton = ({ onNftsFetched }) => {
    const [ownedNfts, setOwnedNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

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
            onNftsFetched(allOwnedNFTs.flat()); 
            registerUserNFTs(allOwnedNFTs.flat());

            setIsModalOpen(true);
        } catch (err) {
            setError(err.message);
            setModalMessage("Failed to register NFTs.");
            setIsModalOpen(true);
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
                setModalMessage("NFTs registered successfully!");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registering NFTs failed');
            }
        } catch (error) {
            console.error("Failed to register NFTs:", error);
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
                className="btn"
            >
                Register NFTs
            </button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <AlertModal
                isOpen={isModalOpen}
                message={modalMessage}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default RegisterNftButton;
