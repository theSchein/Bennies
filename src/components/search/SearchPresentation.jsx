function SearchPresentation({
    searchTerm,
    setSearchTerm,
    suggestions,
    error,
    handleClick,
}) {
    return (
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search NFTs, artists, collections..."
              className="w-full p-4 pl-12 border-2 border-gray-300 rounded-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
            <svg className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01"></path>
            </svg>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <ul className="w-full space-y-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} className="p-2 border-b border-gray-200">
                {suggestion.name}
              </li>
            ))}
          </ul>
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-secondary text-tertiary rounded-full hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 transition ease-in duration-200"
          >
            Search
          </button>
        </div>
      );
      
}

export default SearchPresentation;
