import { buildApiUrl } from "./config";

export const getZones = async ({ parkingFacility, name, code, signal } = {}) => {
  const queryParams = new URLSearchParams();

  if (parkingFacility) {
    queryParams.set("parking_facility", parkingFacility);
  }

  if (name) {
    queryParams.set("name", name);
  }

  if (code) {
    queryParams.set("code", code);
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `${buildApiUrl("/zones/")}?${queryString}`
    : buildApiUrl("/zones/");

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch zones (${response.status})`);
  }

  return response.json();
};
