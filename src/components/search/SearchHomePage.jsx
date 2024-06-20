import * as React from "react";
import { useState } from "react";
import { useTheme, LinearProgress } from "@mui/material";
import NftTile from "../nft/nftTile";
import TokenTile from "../token/tokenTile";
import Modal from "../ui/Modal";
import AlertModal from "../alert";

function SearchHomepage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [tokenResults, setTokenResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const theme = useTheme();

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSearchResults(null);
        setTokenResults(null);
        try {
            const nftResponse = await fetch("/api/search/addressSearch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address: searchTerm }),
            });

            const tokenResponse = await fetch("/api/search/tokenSearch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address: searchTerm }),
            });

            if (!nftResponse.ok || !tokenResponse.ok) {
                throw new Error("Search failed");
            }

            const nftData = await nftResponse.json();
            const tokenData = await tokenResponse.json();

            setSearchResults(nftData.nfts);
            setTokenResults(tokenData.tokens);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/footer/waitlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
            setAlertMessage("Thank you for subscribing!");
        } else {
            setAlertMessage("Something went wrong. Please try again.");
        }

        setName("");
        setEmail("");
        setShowEmailModal(false);
        setShowAlertModal(true);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-light-font dark:text-light-ennies mb-6">
                Try it
            </h2>
            <div className="max-w-2xl w-full mt-5 px-4 sm:px-0">
                <AlertModal
                    isOpen={showAlertModal}
                    message={alertMessage}
                    onClose={() => setShowAlertModal(false)}
                />
                <form
                    onSubmit={handleSearchSubmit}
                    className="w-full flex flex-col items-center"
                >
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter any Ethereum wallet or ENS address"
                        className="mb-4 w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm sm:text-base"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 w-full btn rounded-full text-center items-center transition ease-in duration-200 text-lg sm:text-base mb-3"
                    >
                        Search Address
                    </button>
                </form>
                <div className="w-full flex justify-center mt-4">
                    <button
                        className="px-6 py-2 w-full sm:w-auto btn rounded-full text-center items-center transition ease-in duration-200 text-lg sm:text-base"
                        onClick={() => setShowEmailModal(true)}
                    >
                        Subscribe to Mailing List
                    </button>
                </div>
                {isLoading && (
                    <div className="w-full mt-4">
                        <LinearProgress
                            sx={{
                                height: 4,
                                borderRadius: 5,
                                backgroundColor:
                                    theme.palette.mode === "light"
                                        ? theme.palette.light.quaternary
                                        : theme.palette.dark.quaternary,
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                    backgroundColor:
                                        theme.palette.mode === "light"
                                            ? theme.palette.light.primary
                                            : theme.palette.dark.tertiary,
                                },
                            }}
                        />
                    </div>
                )}
            </div>
            {searchResults === null && tokenResults === null && !isLoading && (
                <div className="w-full px-2 mt-4 text-center flex justify-center">
                    <div className="max-w-xl">
                        <p className="text-lg md:text-xl text-primary dark:text-dark-primary">
                            Enter a wallet address to see the owned NFTs and their
                            benefits. Try searching{" "}
                            <span className="font-bold italic">discovry.eth</span> to
                            see how it works.
                        </p>
                    </div>
                </div>
            )}
            {!isLoading && tokenResults && tokenResults.length > 0 && (
                <div className="w-full px-2 mt-8">
                    <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl text-light-font dark:text-light-ennies mb-6">
                        Owned Tokens
                    </h3>
                    <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 text-light-font dark:text-dark-primary rounded-lg shadow-lg p-6 mb-8 w-full">
                        <div className="overflow-x-auto">
                            <div className="flex flex-wrap gap-4">
                                {tokenResults.map((token, index) => (
                                    <div key={index} className="w-64">
                                        <TokenTile token={token} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!isLoading && searchResults && searchResults.length > 0 && (
                <div className="w-full px-2">
                    <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl text-light-font dark:text-light-ennies mb-6">
                        Owned NFTs
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 justify-items-center">
                        {searchResults.map((nft) => (
                            <NftTile key={nft.nft_id} nft={nft} />
                        ))}
                    </div>
                </div>
            )}
            <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)}>
                <form
                    onSubmit={handleEmailSubmit}
                    className="flex flex-col items-center mt-10 bg-light-tertiary dark:bg-dark-primary dark:text-dark-quaternary p-4 sm:p-6 lg:p-8 rounded-2xl bg-opacity-80 shadow-xl max-w-md mb-5 w-full"
                >
                    <h2 className="text-xl sm:text-2xl lg:text-2xl mb-4 text-secondary font-subheading font-bold text-center">
                        Sign up for our mailing list
                    </h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your Name"
                        className="mb-4 w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm sm:text-base"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="mb-4 w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm sm:text-base"
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 w-full btn rounded-full text-center items-center transition ease-in duration-200 text-lg sm:text-base"
                    >
                        Submit
                    </button>
                </form>
            </Modal>
        </div>
    );
}

export default SearchHomepage;
