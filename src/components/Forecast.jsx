import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { weatherIcons } from "../weatherIcons";

export default function Forecast() {
  // 🔹 Get weather data from WeatherContext
  const { data } = useContext(WeatherContext);

  // 🔹 Return nothing if daily forecast data is not available
  if (!data?.daily) return null;

  return (
    <div className="card">
      {/* 🔹 Title for the forecast */}
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
              {/* 🔹 Format date for readability */}
              <td>
                {new Date(day).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </td>

              {/* 🔹 Minimum temperature with unit */}
              <td>
                {data.daily.temperature_2m_min[i]}
                {data.daily_units.temperature_2m_min} {/* temperature unit */}
              </td>

              {/* 🔹 Maximum temperature with unit */}
              <td>
                {data.daily.temperature_2m_max[i]}
                {data.daily_units.temperature_2m_max} {/* temperature unit */}
              </td>

              {/* 🔹 Rain/precipitation with unit */}
              <td>
                {data.daily.precipitation_sum[i]}
                {data.daily_units.precipitation_sum} {/* rain unit */}
              </td>

              {/* 🔹 Weather icon based on weather code */}
              <td>
                {weatherIcons?.[data.daily.weathercode[i]] || "❓"}
                {/* fallback icon */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
