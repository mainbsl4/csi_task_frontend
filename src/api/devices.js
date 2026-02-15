import { buildApiUrl } from "./config";

export const getDevicesStatus = async ({ facility, zoneCode, signal } = {}) => {
  const queryParams = new URLSearchParams();

  if (facility) {
    queryParams.set("facility", facility);
  }

  if (zoneCode) {
    queryParams.set("zone_code", zoneCode);
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `${buildApiUrl("/devices/status/")}?${queryString}`
    : buildApiUrl("/devices/status/");

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch device status (${response.status})`);
  }

  return response.json();
};
