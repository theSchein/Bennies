// components/search/SearchHomepage.jsx
// This component handles the presentation for the search bar. On the Home Page

import * as React from "react";
import useSearch from "../hooks/useSearch";

function SearchHomepage() {
    const { searchTerm, setSearchTerm, handleSubmit } = useSearch();

    return (
        <div className="flex flex-col items-center w-2/3 max-w-2xl mt-5">
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center"
            >
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Explore NFTs, artists, collections..."
                    className="mb-4 w-full p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
                <div className="w-1/4 bg-light-secondary dark:bg-dark-secondary bg-opacity-90 rounded-full shadow-xl">
                    <button
                        type="submit"
                        className="px-6 py-2 w-full h-full text-light-quaternary dark:text-dark-quaternary bg-light-primary dark:bg-dark-primary rounded-full transition ease-in duration-200 hover:bg-light-quaternary dark:hover:bg-dark-tertiary hover:text-light-secondary dark:hover:text-dark-secondary"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SearchHomepage;
