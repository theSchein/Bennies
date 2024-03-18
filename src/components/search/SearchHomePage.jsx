import * as React from "react";
import { useSession } from "next-auth/react";
import Modal from "../ui/Modal";
import AuthForm from "../auth/authForm";

function SearchHomepage() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            setIsModalOpen(true); // Open the modal if the user is not signed in
            return;
        }

        // Proceed with the search if the user is signed in
        try {
            const response = await fetch('/api/search/addressSearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address: searchTerm }),
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            setSearchResults(data.nfts); // Assuming the API returns an object with an nfts property
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mt-5 px-4 sm:px-0">
            <form onSubmit={handleSearchSubmit} className="w-full flex flex-col items-center">
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
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AuthForm />
            </Modal>
            {/* Assuming you have a component to display the search results */}
            {/* {searchResults && <SearchResultsComponent results={searchResults} />} */}
        </div>
    );
}

export default SearchHomepage;
