import { weatherIcons } from "./App";

export default function CurrentWeather({ place, data }) {
  return (
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
        {data.current.weathercode !== undefined
          ? weatherIcons[data.current.weathercode]
          : "❓"}
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
  );
}
