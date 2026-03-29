import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import CitySearch from "./components/CitySearch";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import ErrorMessage from "./components/ErrorMessage";
import Skeleton from "./components/Skeletons";

export default function App() {
  // focus on input
  useEffect(() => {
    const input = document.querySelector("input");
    input?.focus();
  }, []);

  return (
    <div className="app">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="card">
        <h1>Weather App (Autocomplete)</h1>
        <div className="muted">
          Type a city → select from suggestions → get weather.
        </div>
        {/* CitySearch */}
        <CitySearch />

        {/* Skeleton */}
        <Skeleton />

        {/* Error Message */}
        <ErrorMessage />

        {/* CurrentWeather + Forecast */}
        <div className="grid fade-in">
          <CurrentWeather />
          <Forecast />
        </div>
      </div>
    </div>
  );
}
