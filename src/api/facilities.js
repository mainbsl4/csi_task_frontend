import { buildApiUrl } from "./config";

export const getFacilities = async ({ name, signal } = {}) => {
  const queryParams = new URLSearchParams();

  if (name) {
    queryParams.set("name", name);
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `${buildApiUrl("/facilities/")}?${queryString}`
    : buildApiUrl("/facilities/");

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch facilities (${response.status})`);
  }

  return response.json();
};
