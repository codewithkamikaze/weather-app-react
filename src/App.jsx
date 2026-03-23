import { useState, useRef, useEffect } from "react";
import { weatherIcons } from "./weatherIcons";

import { Toaster } from "react-hot-toast";
import { showSuccess, showError } from "./services/toastService";
import CurrentWeather from "./components/CurrentWeather";
import ErrorMessage from "./components/ErrorMessage";
import Forecast from "./components/Forecast";
import Skeleton from "./components/Skeletons";
import CitySearch from "./components/CitySearch";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FC_URL = "https://api.open-meteo.com/v1/forecast";

// helper debounce
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function App() {
  const [city, setCity] = useState("Aleppo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [place, setPlace] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const controllerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // FETCH SUGGESTIONS (DEBOUNCED)
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

  async function runSearch(cityName) {
    if (!cityName.trim()) {
      setError("Please enter a city name.");
      showError("Please enter a city name.");
      return;
    }

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const geoRes = await fetch(
        `${GEO_URL}?name=${cityName}&count=1&language=en&format=json`,
        { signal: controller.signal },
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Try another name.");
      }

      const placeData = geoData.results[0];
      setPlace(placeData);

      const fcRes = await fetch(
        `${FC_URL}?latitude=${placeData.latitude}&longitude=${placeData.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,weathercode&timezone=auto`,
        { signal: controller.signal },
      );

      const weatherData = await fcRes.json();
      setData(weatherData);
      showSuccess(`Weather for ${placeData.name} loaded successfully!`);
    } catch (err) {
      if (err.name === "AbortError") return;
      setData(null);
      if (err.message.includes("Failed to fetch")) {
        setError("Network error. Check your internet connection.");
        showError("Network error. Check your internet connection.");
      } else {
        setError(err.message);
        showError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="card">
        <h1>Weather App (Autocomplete)</h1>
        <div className="muted">
          Type a city → select from suggestions → get weather.
        </div>

        {/* CitySearch */}

        <div className="row" style={{ marginTop: 12, position: "relative" }}>
          <input
            ref={inputRef}
            placeholder="Type a city…"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch(city);
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

          {/* Suggestions dropdown */}
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
                    runSearch(s.name);
                  }}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {s.name}, {s.country}
                </div>
              ))}
            </div>
          )}
        </div>

        {/*=== CitySearch==== */}

        {/* Loading skeleton */}

        {loading && <Skeleton />}

        {/* ===Loading skeleton==== */}

        {/* Error */}

        {error && (
          <ErrorMessage
            error={error}
            runSearch={runSearch}
            city={city}
            loading={loading}
          />
        )}

        {/* Error ===*/}
        {/* Result */}

        {data && place && !loading && (
          <div className="grid fade-in">
            {/* CurrentWeather */}

            <CurrentWeather
              data={data}
              place={place}
              weatherIcons={weatherIcons}
            />

            {/* ===CurrentWeather=== */}

            {/* Forecast */}

            <Forecast data={data} weatherIcons={weatherIcons} />

            {/*===== Forecast ===== */}
          </div>
        )}
      </div>
    </div>
  );
}
