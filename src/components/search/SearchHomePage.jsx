// components/search/SearchHomepage.jsx
// This component handles the presentation for the search bar. On the Home Page

import * as React from "react";
import useSearch from "../hooks/useSearch";
import { useSession } from "next-auth/react";
import Modal from "../ui/Modal";
import AuthForm from "../auth/authForm";

function SearchHomepage() {
    const { data: session, status } = useSession();
    const { searchTerm, setSearchTerm, handleSubmit } = useSearch();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!session) {
            setIsModalOpen(true); // Open the modal if the user is not signed in
        } else {
            handleSubmit(e); // Proceed with the search if the user is signed in
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mt-5 px-4 sm:px-0">
            <form
                onSubmit={handleSearchSubmit}
                className="w-full flex flex-col items-center"
            >
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Explore NFTs and collections"
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
        </div>
    );
}

export default SearchHomepage;
