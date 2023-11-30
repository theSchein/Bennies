// components/search/SearchBar.jsx
// This component handles the logic for the search bar. On the Search Page

import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/search?query=${encodeURIComponent(searchTerm)}`,
                );
                const data = await response.json();
                setSuggestions(data.results || []);
            } catch (err) {
                setError("Failed to fetch suggestions");
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [searchTerm]);

    const handleClick = (e) => {
        e.preventDefault();
        router.push("/search?query=" + searchTerm);
    };

    return (
        <Bar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
            loading={loading}
            error={error}
            handleClick={handleClick}
        />
    );
}

function Bar({
    searchTerm,
    setSearchTerm,
    suggestions,
    loading,
    error,
    handleClick,
}) {
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
                    onClick={handleClick}
                    className="p-2 text-white rounded hover:bg-opacity-80 ml-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500" // Gray gradient styling
                >
                    Submit
                </button>
            </div>
            {error && <div className="text-secondary">{error}</div>}
            <ul className="w-full space-y-2">
                {suggestions.map((suggestion) => (
                    <li key={suggestion.id} className="p-2 border-b">
                        {suggestion.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchBar;
