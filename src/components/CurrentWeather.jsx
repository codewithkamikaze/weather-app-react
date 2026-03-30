import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { weatherIcons } from "../weatherIcons";

export default function CurrentWeather() {
  // 🔹 Get weather data and place info from context
  const { data, place } = useContext(WeatherContext);

  // 🔹 Return nothing if data or place is not available
  if (!data?.current || !place) return null;

  const current = data.current;

  return (
    <div className="card">
      {/* 🔹 Display city name and country */}
      <h2>
        {place.name}, {place.country}
      </h2>

      {/* 🔹 Display current temperature with units */}
      <div style={{ fontSize: "48px", fontWeight: "bold" }}>
        {current.temperature_2m}
        {data.current_units.temperature_2m}
        {/* here we show the temperature unit */}
      </div>

      {/* 🔹 Display weather icon based on weather code */}
      <div style={{ fontSize: "40px", margin: "10px 0" }}>
        {weatherIcons?.[current.weathercode] || "❓"}
        {/* fallback icon if code missing */}
      </div>

      {/* 🔹 Display humidity */}
      <div className="muted">
        💧 Humidity: {current.relative_humidity_2m}
        {data.current_units.relative_humidity_2m}
        {/* here we show humidity unit */}
      </div>

      {/* 🔹 Display wind speed */}
      <div className="muted">
        💨 Wind: {current.wind_speed_10m}
        {data.current_units.wind_speed_10m} {/* here we show wind unit */}
      </div>
    </div>
  );
}
