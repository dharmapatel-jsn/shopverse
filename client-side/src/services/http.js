const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

const toPath = (path) => (path.startsWith("/") ? path : `/${path}`);

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${toPath(path)}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
};
