// components/hooks/useSearch.jsx
// This component handles the logic for the search.

import { useState } from "react";
import { useRouter } from "next/router";

function useSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push("/search?query=" + encodeURIComponent(searchTerm));
    };

    return {
        searchTerm,
        setSearchTerm,
        handleSubmit,
    };
}

export default useSearch;

