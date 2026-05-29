import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Fallo HTTP", {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      code: error.code,
    });

    return Promise.reject(error);
  }
);