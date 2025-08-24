import React, { useState } from "react";

const GBIF_API = "https://api.gbif.org/v1/species/search";

const GBIFSpeciesPopup = ({ onClose, onSelectSpecies }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchSpecies = async () => {
    setLoading(true);
    try {
        console.log(`${GBIF_API}?q=${encodeURIComponent(query)}&limit=10`)
      const res = await fetch(
        `${GBIF_API}?q=${encodeURIComponent(query)}&limit=10`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (e) {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded shadow-lg p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-2">Search GBIF Species</h2>
        <input
          type="text"
          className="w-full border px-2 py-1 rounded mb-2"
          placeholder="Enter species name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchSpecies()}
        />
        <button
          className="bg-green-600 text-white px-3 py-1 rounded mb-2"
          onClick={searchSpecies}
          disabled={loading || !query}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <div className="max-h-48 overflow-y-auto">
          {results.map((species) => (
            <button
              key={species.key}
              className="block w-full text-left px-2 py-1 hover:bg-green-50 rounded"
              onClick={() => onSelectSpecies(species)}
            >
              <div className="font-medium">{species.scientificName}</div>
              <div className="text-xs text-gray-500">
                {species.canonicalName}
              </div>
            </button>
          ))}
          {!loading && results.length === 0 && query && (
            <div className="text-gray-400 text-sm mt-2">No results found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GBIFSpeciesPopup;
