import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "../ui/Modal";
import AuthForm from "../auth/authForm";
import { LinearProgress } from "@mui/material";
import NftTile from "../nft/nftTile";

function SearchHomepage() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                        placeholder="Enter wallet address"
                        className="mb-4 w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm sm:text-base"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 w-full btn rounded-full transition ease-in duration-200 text-lg sm:text-base"
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
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                    backgroundColor: "#1a90ff", // Customize the progress bar color here
                                },
                            }}
                        />
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AuthForm />
            </Modal>
            {!isLoading && searchResults && (
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
