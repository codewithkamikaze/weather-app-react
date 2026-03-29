import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { WeatherProvider } from "./context/WeatherProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WeatherProvider>
      <App />
    </WeatherProvider>
  </React.StrictMode>,
);
