// const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
// const FC_URL = "https://api.open-meteo.com/v1/forecast";

// export async function getGeo(cityName, signal) {
//   const res = await fetch(
//     `${GEO_URL}?name=${cityName}&count=1&language=en&format=json`,
//     { signal },
//   );
//   return res.json();
// }

// export async function getForecast(lat, lon, signal) {
//   const res = await fetch(
//     `${FC_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,weathercode&timezone=auto`,
//     { signal },
//   );
//   return res.json();
// }
