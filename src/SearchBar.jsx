import { useState, useRef, useEffect } from "react";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ForecastTable from "./ForecastTable";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FC_URL = "https://api.open-meteo.com/v1/forecast";

export default function App() {
  const [city, setCity] = useState("Aleppo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [place, setPlace] = useState(null);

  const controllerRef = useRef(null);

  // البحث و API
  async function runSearch(cityName) {
    if (!cityName.trim()) {
      setError("Please enter a city name.");
      return;
    }

    if (controllerRef.current) controllerRef.current.abort();
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

      if (!geoData.results || geoData.results.length === 0)
        throw new Error("City not found. Try another name.");

      const placeData = geoData.results[0];

      // مقارنة ذكية للاسم
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
    } catch (err) {
      if (err.name === "AbortError") return;

      if (err.message.includes("Failed to fetch")) {
        setError("Network error. Check your internet connection.");
      } else {
        setError(err.message);
      }

      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  return (
    <div className="app">
      <div className="card">
        <h1>Weather App (Public API)</h1>
        <div className="muted">
          Search any city → get current weather + 7-day forecast.
        </div>

        {/* SearchBar */}
        <SearchBar
          city={city}
          setCity={setCity}
          runSearch={runSearch}
          loading={loading}
          error={error}
          setError={setError}
        />

        {/* Loading */}
        {loading && (
          <div className="status">
            <div className="spinner"></div>
            <div>Loading…</div>
          </div>
        )}

        {/* Error */}
        {error && <div className="error">❌ {error}</div>}

        {/* Result */}
        {data && place && (
          <div className="grid">
            <CurrentWeather place={place} data={data} />
            <ForecastTable data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
