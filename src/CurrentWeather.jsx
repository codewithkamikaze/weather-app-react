import React from "react";

export default function SearchBar({
  city,
  setCity,
  runSearch,
  loading,
  error,
  setError,
}) {
  return (
    <div className="row" style={{ marginTop: 12 }}>
      <input
        placeholder="Type a city…"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          if (error) setError(""); // auto-clear error
        }}
      />

      <button
        onClick={() => runSearch(city)}
        disabled={loading || !city.trim()}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      <button
        className="secondary"
        disabled={loading}
        onClick={() => {
          setCity("Aleppo");
          runSearch("Aleppo");
        }}
      >
        Use Aleppo
      </button>
    </div>
  );
}
