// components/search/SearchHomePage.jsx
import * as React from "react";
import { useState } from "react";
import { useTheme, LinearProgress } from "@mui/material";
import NftTile from "../nft/nftTile";

function SearchHomepage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme(); // Access the current theme

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Proceed with the search
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
                        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-light-font dark:text-light-ennies mb-6">Try it</h2>
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
                        className="px-6 py-2 w-full btn rounded-full text-center items-center transition ease-in duration-200 text-lg sm:text-base mb-3"
                    >
                        Search Address
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
            {searchResults === null && !isLoading && (
                <div className="w-full px-2 mt-4 text-center flex justify-center">
                    <div className="max-w-xl">
                        <p className="text-lg md:text-xl text-primary dark:text-dark-primary">
                            Enter a wallet address to see the owned NFTs and their benefits.
                            Try searching <span className="font-bold italic">discovry.eth</span> to see how it works.
                        </p>
                    </div>
                </div>
            )}
            {!isLoading && searchResults && searchResults.length === 0 && (
                <div className="w-full px-2 mt-4 text-center flex justify-center">
                    <div className="max-w-xl">
                        <p className="text-lg md:text-xl text-primary dark:text-dark-primary">
                            No NFTs found in this wallet, but our database of
                            supported NFTs is growing rapidly. To have your assets
                            supported sooner, please reach out to ben@bennies.fun
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
