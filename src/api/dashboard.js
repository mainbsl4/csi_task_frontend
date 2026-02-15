import { buildApiUrl } from "./config";

export const getDashboardSummary = async (
  { date, facility, zoneCode, signal } = {},
) => {
  const queryParams = new URLSearchParams();

  if (date) {
    queryParams.set("date", date);
  }

  if (facility) {
    queryParams.set("facility", facility);
  }

  if (zoneCode) {
    queryParams.set("zone_code", zoneCode);
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `${buildApiUrl("/dashboard/summary/")}?${queryString}`
    : buildApiUrl("/dashboard/summary/");

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard summary (${response.status})`);
  }

  return response.json();
};
