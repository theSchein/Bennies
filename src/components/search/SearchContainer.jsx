// components/search/SearchContainer.jsx
// This component handles the logic for the search on the home page.

import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import SearchPresentation from "./SearchPresentation";

function SearchContainer() {
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
        <SearchPresentation
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
            loading={loading}
            error={error}
            handleClick={handleClick}
        />
    );
}

export default SearchContainer;
