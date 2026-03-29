import { useState, useRef } from "react";
import { WeatherContext } from "./WeatherContext"; // import context from separate file
import { showSuccess, showError } from "../services/toastService";

export function WeatherProvider({ children }) {
  // 🔹 Global state for the app
  const [city, setCity] = useState("Aleppo"); // selected city
  const [loading, setLoading] = useState(false); // loading state for API calls
  const [error, setError] = useState(""); // error message
  const [data, setData] = useState(null); // weather data
  const [place, setPlace] = useState(null); // selected place details
  const [suggestions, setSuggestions] = useState([]); // autocomplete suggestions

  // 🔹 Abort controller to cancel previous requests
  const controllerRef = useRef(null);

  // 🔹 API endpoints
  const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const FC_URL = "https://api.open-meteo.com/v1/forecast";

  // 🔹 Debounce helper to limit API calls while typing
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer); // clear previous timer
      timer = setTimeout(() => func(...args), delay); // run function after delay
    };
  };

  // 🔹 Fetch city suggestions (debounced)
  const fetchSuggestionsRef = useRef(
    debounce(async (query) => {
      if (!query.trim()) return setSuggestions([]); // clear if input empty

      try {
        const userLang = navigator.language.slice(0, 2) || "en";
        const supportedLangs = ["en", "ar", "de", "fr", "es"];
        const lang = supportedLangs.includes(userLang) ? userLang : "en";

        const res = await fetch(
          `${GEO_URL}?name=${query}&count=5&language=${lang}&format=json`,
        );
        const data = await res.json();

        setSuggestions(data.results || []); // update suggestions list
      } catch {
        setSuggestions([]); // fallback if request fails
      }
    }, 300),
  );

  // 🔹 Wrapper function to call debounced suggestions
  const fetchSuggestions = (query) => fetchSuggestionsRef.current(query);

  // 🔹 Main function to search for weather data
  const runSearch = async (cityName) => {
    if (!cityName.trim()) {
      setError("Please enter a city name.");
      showError("Please enter a city name.");
      return;
    }

    // 🔹 Cancel previous request if exists
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");
    setSuggestions([]); // clear suggestions when searching

    try {
      const userLang = navigator.language.slice(0, 2) || "en";
      const supportedLangs = ["en", "ar", "de", "fr", "es"];
      const lang = supportedLangs.includes(userLang) ? userLang : "en";

      // 🔹 Fetch location data (latitude & longitude)
      const geoRes = await fetch(
        `${GEO_URL}?name=${cityName}&count=1&language=${lang}&format=json`,
        { signal: controller.signal },
      );
      const geoData = await geoRes.json();

      if (!geoData.results?.length)
        throw new Error("City not found. Try another name.");

      const placeData = geoData.results[0];

      setPlace(placeData); // store place info
      setCity(`${placeData.name}, ${placeData.country}`); // update display city

      // 🔹 Fetch weather forecast using coordinates
      const fcRes = await fetch(
        `${FC_URL}?latitude=${placeData.latitude}&longitude=${placeData.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,weathercode&timezone=auto`,
        { signal: controller.signal },
      );

      const weatherData = await fcRes.json();
      setData(weatherData); // store weather data

      showSuccess(`Weather for ${placeData.name} loaded successfully!`);
    } catch (err) {
      if (err.name === "AbortError") return; // ignore aborted requests

      setData(null);

      const msg = err.message.includes("Failed to fetch")
        ? "Network error. Check your internet connection."
        : err.message;

      setError(msg);
      showError(msg);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        loading,
        setLoading,
        error,
        setError,
        data,
        setData,
        place,
        setPlace,
        suggestions,
        setSuggestions,
        controllerRef,
        fetchSuggestions,
        runSearch,
      }}
    >
      {children} {/* 🔹 wrap all app components */}
    </WeatherContext.Provider>
  );
}
