function SearchPresentation({ searchTerm, setSearchTerm, suggestions, loading, error, handleClick }) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="p-2 border rounded"
            />
            {loading && <div className="text-tertiary">Loading...</div>}
            {error && <div className="text-secondary">{error}</div>}
            <ul className="w-full space-y-2">
                {suggestions.map((suggestion) => (
                    <li key={suggestion.id} className="p-2 border-b">{suggestion.name}</li>
                ))}
            </ul>
            <button onClick={handleClick} className="p-2 bg-tertiary text-primary rounded hover:bg-quaternary">Submit</button>
        </div>
    );
}

export default SearchPresentation;
