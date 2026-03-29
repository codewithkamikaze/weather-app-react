// src/context/WeatherProvider.jsx
import { useState, useRef } from "react";
import { WeatherContext } from "./WeatherContext"; // 👈 استيراد الـ Context من الملف الصحيح
import { showSuccess, showError } from "../services/toastService";

export function WeatherProvider({ children }) {
  const [city, setCity] = useState("Aleppo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [place, setPlace] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const controllerRef = useRef(null);

  const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const FC_URL = "https://api.open-meteo.com/v1/forecast";

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestionsRef = useRef(
    debounce(async (query) => {
      if (!query.trim()) return setSuggestions([]);
      try {
        const userLang = navigator.language.slice(0, 2) || "en";
        const supportedLangs = ["en", "ar", "de", "fr", "es"];
        const lang = supportedLangs.includes(userLang) ? userLang : "en";

        const res = await fetch(
          `${GEO_URL}?name=${query}&count=5&language=${lang}&format=json`,
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch {
        setSuggestions([]);
      }
    }, 300),
  );

  const fetchSuggestions = (query) => fetchSuggestionsRef.current(query);

  const runSearch = async (cityName) => {
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
      const userLang = navigator.language.slice(0, 2) || "en";
      const supportedLangs = ["en", "ar", "de", "fr", "es"];
      const lang = supportedLangs.includes(userLang) ? userLang : "en";

      const geoRes = await fetch(
        `${GEO_URL}?name=${cityName}&count=1&language=${lang}&format=json`,
        { signal: controller.signal },
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.length)
        throw new Error("City not found. Try another name.");

      const placeData = geoData.results[0];
      setPlace(placeData);
      setCity(`${placeData.name}, ${placeData.country}`);

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
      const msg = err.message.includes("Failed to fetch")
        ? "Network error. Check your internet connection."
        : err.message;
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
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
      {children}
    </WeatherContext.Provider>
  );
}
