export default function Forecast({ data, weatherIcons }) {
  // safety check (prevents crash if data not ready)
  if (!data?.daily) return null;

  return (
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
              {/* formatted date */}
              <td>
                {new Date(day).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </td>

              {/* min temp */}
              <td>
                {data.daily.temperature_2m_min[i]}
                {data.daily_units.temperature_2m_min}
              </td>

              {/* max temp */}
              <td>
                {data.daily.temperature_2m_max[i]}
                {data.daily_units.temperature_2m_max}
              </td>

              {/* rain */}
              <td>
                {data.daily.precipitation_sum[i]}{" "}
                {data.daily_units.precipitation_sum}
              </td>

              {/* weather icon */}
              <td>{weatherIcons?.[data.daily.weathercode[i]] || "❓"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
