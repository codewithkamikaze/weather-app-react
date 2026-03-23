// toastService.js
import { toast } from "react-hot-toast";

// Toast for success
export function showSuccess(message = "Weather loaded successfully!") {
  toast.success(message, {
    duration: 2500,
    position: "bottom-left",
    style: {
      background: "#1e2a47",
      color: "#e9eefc",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      fontWeight: "600",
      fontSize: "14px",
    },
    iconTheme: {
      primary: "#4f7cff",
      secondary: "#e9eefc",
    },
  });
}

// Toast for error
export function showError(message = "Something went wrong. Please try again!") {
  toast.error(message, {
    duration: 2500,
    position: "bottom-left",
    style: {
      background: "#3b1e2a",
      color: "#ffe9e9",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      fontWeight: "600",
      fontSize: "14px",
    },
    iconTheme: {
      primary: "#ff4f6d",
      secondary: "#ffe9e9",
    },
  });
}
