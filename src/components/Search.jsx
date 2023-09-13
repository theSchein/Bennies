import * as React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function SearchComponent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSuggestions([]); // Clear suggestions if search term is empty
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
        router.push("/searchResults?query=" + searchTerm);
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
            />
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <ul>
                {suggestions.map((suggestion) => (
                    <li key={suggestion.id}>{suggestion.name}</li>
                ))}
            </ul>
            <button onClick={handleClick}>Submit</button>
        </div>
    );
}

export default SearchComponent;
