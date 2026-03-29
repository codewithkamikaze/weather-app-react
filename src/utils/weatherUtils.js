export const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const FC_URL = "https://api.open-meteo.com/v1/forecast";

// helper debounce → يمكن استخدامه لأي دالة
export function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
