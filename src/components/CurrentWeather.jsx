export default function CurrentWeather({ data, place, weatherIcons }) {
  if (!data?.current || !place) return null;

  const current = data.current;

  return (
    <div className="card">
      {/* city */}
      <h2>
        {place.name}, {place.country}
      </h2>

      {/* temperature */}
      <div style={{ fontSize: "48px", fontWeight: "bold" }}>
        {current.temperature_2m}
        {data.current_units.temperature_2m}
      </div>

      {/* icon */}
      <div style={{ fontSize: "40px", margin: "10px 0" }}>
        {weatherIcons?.[current.weathercode] || "❓"}
      </div>

      {/* details */}
      <div className="muted">
        💧 Humidity: {current.relative_humidity_2m}
        {data.current_units.relative_humidity_2m}
      </div>

      <div className="muted">
        💨 Wind: {current.wind_speed_10m}
        {data.current_units.wind_speed_10m}
      </div>
    </div>
  );
}
