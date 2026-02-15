const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
