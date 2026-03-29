import { useState, useRef, useEffect, useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";

export default function CitySearch() {
  // 🔹 Get state and functions from WeatherContext
  const {
    city,
    setCity,
    loading,
    suggestions,
    setSuggestions,
    fetchSuggestions,
    runSearch,
  } = useContext(WeatherContext);

  // 🔹 Track which suggestion is currently highlighted
  const [activeIndex, setActiveIndex] = useState(-1);

  // 🔹 Reference to the input element for focus control
  const inputRef = useRef(null);

  // 🔹 Focus input automatically when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 🔹 Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".row")) setSuggestions([]); // here we clear suggestions if clicked outside
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setSuggestions]);

  return (
    <div className="row" style={{ marginTop: 12, position: "relative" }}>
      {/* 🔹 City input field */}
      <input
        ref={inputRef}
        placeholder="Type a city…"
        value={city}
        onChange={(e) => {
          setCity(e.target.value); // update city state
          fetchSuggestions(e.target.value); // fetch autocomplete suggestions
          setActiveIndex(-1); // reset active index
        }}
        onKeyDown={(e) => {
          // 🔹 Navigate suggestions using arrow keys
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : prev,
            );
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          // 🔹 Handle Enter key: select suggestion or run search
          if (e.key === "Enter") {
            if (suggestions[activeIndex]) {
              const s = suggestions[activeIndex];
              setCity(`${s.name}, ${s.country}`);
              setSuggestions([]);
              runSearch(s.name); // here we make search for the selected suggestion
            } else runSearch(city); // search using typed city
          }
        }}
      />

      {/* 🔹 Search button */}
      <button
        onClick={() => runSearch(city)}
        disabled={loading || !city.trim()} // disable when loading or empty input
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {/* 🔹 Quick select button for example city */}
      <button
        className="secondary"
        disabled={loading}
        onClick={() => {
          setCity("Aleppo");
          setSuggestions([]);
          runSearch("Aleppo"); // here we make user search for example city "Aleppo"
        }}
      >
        Use Aleppo
      </button>

      {/* 🔹 Suggestions dropdown */}
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
                runSearch(s.name); // here we make search for clicked suggestion
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                background: i === activeIndex ? "#2a2f45" : "transparent", // highlight active suggestion
              }}
              onMouseEnter={() => setActiveIndex(i)} // hover changes active index
            >
              {s.name}, {s.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
