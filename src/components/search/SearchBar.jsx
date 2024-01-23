// components/search/SearchBar.jsx
// This component handles the logic for the search bar. On the Search Page

import * as React from "react";
import useSearch from "../hooks/useSearch";


function SearchBar() {
    const { searchTerm, setSearchTerm, handleSubmit } = useSearch();


    return (
        <div className="flex flex-col space-y-4">
            <div className="flex">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="p-2 border rounded w-full"
                />
                <button
                    onClick={handleSubmit}
                    className="p-3 ml-2 text-light-quaternary dark:text-dark-quaternary bg-light-secondary dark:bg-dark-primary rounded-full transition ease-in duration-200 hover:bg-light-quaternary dark:hover:bg-dark-tertiary hover:text-light-secondary dark:hover:text-dark-secondary " // Gray gradient styling
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
