import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";

export default function ErrorMessage() {
  // 🔹 Get error state and search function from WeatherContext
  const { error, runSearch, city, loading } = useContext(WeatherContext);

  // 🔹 Do not render anything if there's no error
  if (!error) return null;

  return (
    <div className="error fade-in">
      {/* 🔹 Display the error message */}❌ {error}
      <div>
        {/* 🔹 Retry button to re-run the search */}
        <button
          onClick={() => runSearch(city)} // here we retry search for the current city
          disabled={loading || !city.trim()} // disable while loading or empty city
        >
          Retry
        </button>
      </div>
    </div>
  );
}
