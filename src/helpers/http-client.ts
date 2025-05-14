import axios from "axios";

const api = axios.create({
  baseURL: "https://api-v3.mbta.com",
  headers: {
    Accept: "application/vnd.api+json",
    "x-api-key": import.meta.env.VITE_MBTA_API_KEY,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.errors?.[0]?.detail || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export default api;
