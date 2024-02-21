// components/search/SearchBar.jsx
// This component handles the logic for the search bar. On the Search Page

import * as React from "react";
import useSearch from "../hooks/useSearch";

function SearchBar() {
    const { searchTerm, setSearchTerm, handleSubmit } = useSearch();

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-3/4 p-2 sm:p-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm sm:text-base"
            />
            <button
                onClick={handleSubmit}
                className="w-1/4 p-2 sm:p-3 text-light-quaternary dark:text-dark-quaternary bg-light-secondary dark:bg-dark-primary rounded-full transition ease-in duration-200 hover:bg-light-quaternary dark:hover:bg-dark-tertiary hover:text-light-secondary dark:hover:text-dark-secondary text-base sm:text-lg" // Adjusted button styling for a bigger appearance
            >
                Submit
            </button>
        </div>
    );
}

export default SearchBar;
