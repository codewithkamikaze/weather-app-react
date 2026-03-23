import { useState, useRef, useEffect } from "react";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

// debounce helper
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function CitySearch({ onSearch, loading }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchSuggestions = debounce(async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `${GEO_URL}?name=${query}&count=5&language=en&format=json`,
      );
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch {
      setSuggestions([]);
    }
  }, 300);

  return (
    <div className="row" style={{ marginTop: 12, position: "relative" }}>
      {/* input */}
      <input
        ref={inputRef}
        placeholder="Type a city…"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch(city);
        }}
      />

      {/* search button */}
      <button onClick={() => onSearch(city)} disabled={loading || !city.trim()}>
        {loading ? "Searching..." : "Search"}
      </button>

      {/* quick button */}
      <button
        className="secondary"
        disabled={loading}
        onClick={() => {
          setCity("Aleppo");
          onSearch("Aleppo");
        }}
      >
        Use Aleppo
      </button>

      {/* suggestions */}
      {suggestions.length > 0 && (
        <div
          className="suggestions"
          style={{
            position: "absolute",
            top: "44px",
            left: 0,
            right: 0,
            background: "#1a1f30",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            zIndex: 10,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => {
                setCity(`${s.name}, ${s.country}`);
                setSuggestions([]);
                onSearch(s.name);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {s.name}, {s.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
