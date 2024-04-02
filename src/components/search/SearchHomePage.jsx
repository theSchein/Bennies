import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "../ui/Modal";
import AuthForm from "../auth/authForm";
import { useTheme, LinearProgress } from "@mui/material";
import NftTile from "../nft/nftTile";

function SearchHomepage() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme(); // Access the current theme

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            setIsModalOpen(true); // Open the modal if the user is not signed in
            return;
        }
        setIsLoading(true);
        // Proceed with the search if the user is signed in
        try {
            const response = await fetch("/api/search/addressSearch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address: searchTerm }),
            });

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            setSearchResults(data.nfts); // Assuming the API returns an object with an nfts property
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="max-w-2xl w-full mt-5 px-4 sm:px-0">
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
                        className="px-6 py-2 w-full btn rounded-full text-center  items-center transition ease-in duration-200 text-lg sm:text-base mb-3"
                    >
                        {session ? "Search Address" : "Sign in to Search"}
                    </button>
                </form>
                {isLoading && (
                    <div className="w-full mt-4">
                        <LinearProgress
                            sx={{
                                height: 4,
                                borderRadius: 5,
                                backgroundColor:
                                    theme.palette.mode === "light"
                                        ? theme.palette.light.quaternary
                                        : theme.palette.dark.quaternary, // Adjust the background color based on the theme
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                    backgroundColor:
                                        theme.palette.mode === "light"
                                            ? theme.palette.light.primary
                                            : theme.palette.dark.tertiary, // Adjust the progress indicator color based on the theme
                                },
                            }}
                        />
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AuthForm />
            </Modal>
            {searchResults === null && !isLoading && (
                <div className="w-full px-2 mt-4 text-center flex justify-center">
                    <div className="max-w-xl">
                        <p className="text-lg md:text-xl text-primary dark:text-dark-primary">
                            Enter an Ethereum wallet address or ENS name to see all
                            NFTs owned by the address their benefits like art
                            license, utility, perks of ownership, and events.
                        </p>
                    </div>
                </div>
            )}
            {!isLoading && searchResults && searchResults.length === 0 && (
                <div className="w-full px-2 mt-4 text-center flex justify-center">
                    <div className="max-w-xl">
                        <p className="text-lg md:text-xl text-primary dark:text-dark-primary">
                            No NFTs found in this wallet, but our database of
                            supported NFTs is growing rapidly. To have your items
                            supported sooner, please reach out to ben@discovry.xyz
                        </p>
                    </div>
                </div>
            )}
            {!isLoading && searchResults && searchResults.length > 0 && (
                <div className="w-full px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 justify-items-center">
                        {searchResults.map((nft) => (
                            <NftTile key={nft.nft_id} nft={nft} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchHomepage;
