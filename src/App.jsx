import { useState, useRef, useEffect } from "react";
import { weatherIcons } from "./weatherIcons";

import { Toaster } from "react-hot-toast";
import { showSuccess, showError } from "./toastService";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FC_URL = "https://api.open-meteo.com/v1/forecast";

export default function App() {
  // STATE
  const [city, setCity] = useState("Aleppo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [place, setPlace] = useState(null);

  const controllerRef = useRef(null);

  // SEARCH FUNCTION
  async function runSearch(cityName) {
    if (!cityName.trim()) {
      setError("Please enter a city name.");
      showError("Please enter a city name.");
      return;
    }

    // cancel previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");

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

      // smart check: compare names
      const input = cityName.toLowerCase();
      const resultName = placeData.name.toLowerCase();
      if (!resultName.includes(input) && !input.includes(resultName)) {
        throw new Error(
          `No accurate match found. Did you mean "${placeData.name}, ${placeData.country}"?`,
        );
      }

      setPlace(placeData);

      const fcRes = await fetch(
        `${FC_URL}?latitude=${placeData.latitude}&longitude=${placeData.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,weathercode&timezone=auto`,
        { signal: controller.signal },
      );

      const weatherData = await fcRes.json();
      setData(weatherData);

      // ✅ Show success toast
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

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="app">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="card">
        <h1>Weather App (Public API)</h1>

        <div className="muted">
          Search any city → get current weather + 7-day forecast.
        </div>

        {/* SEARCH */}
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

        {/* LOADING */}
        {loading && (
          <div className="status">
            <div className="spinner"></div>
            <div>Loading…</div>
          </div>
        )}

        {/* ERROR */}
        {error && <div className="error">❌ {error}</div>}

        {/* RESULT */}
        {data && place && (
          <div className="grid">
            {/* CURRENT */}
            <div className="card">
              <strong>
                {place.name}, {place.country}
              </strong>

              <div className="muted" style={{ marginTop: 6 }}>
                Lat/Lon: {place.latitude}, {place.longitude}
              </div>

              <div className="big">
                {data.current.temperature_2m}
                {data.current_units.temperature_2m}{" "}
                {weatherIcons[data.current.weathercode] || "❓"}
              </div>

              <div>
                <span className="pill">
                  Humidity: {data.current.relative_humidity_2m}
                  {data.current_units.relative_humidity_2m}
                </span>

                <span className="pill">
                  Wind: {data.current.wind_speed_10m}{" "}
                  {data.current_units.wind_speed_10m}
                </span>
              </div>

              <div className="muted" style={{ marginTop: 10 }}>
                Local time: {data.current.time} ({data.timezone})
              </div>
            </div>

            {/* FORECAST */}
            <div className="card">
              <strong>7-Day Forecast</strong>

              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Rain</th>
                    <th>Weather</th>
                  </tr>
                </thead>

                <tbody>
                  {data.daily.time.map((day, i) => (
                    <tr key={i}>
                      <td>{day}</td>
                      <td>
                        {data.daily.temperature_2m_min[i]}
                        {data.daily_units.temperature_2m_min}
                      </td>
                      <td>
                        {data.daily.temperature_2m_max[i]}
                        {data.daily_units.temperature_2m_max}
                      </td>
                      <td>
                        {data.daily.precipitation_sum[i]}{" "}
                        {data.daily_units.precipitation_sum}
                      </td>
                      <td>
                        {data.daily.weathercode?.[i] !== undefined
                          ? weatherIcons[data.daily.weathercode[i]] || "❓"
                          : "❓"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
