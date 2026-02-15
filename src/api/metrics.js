import { buildApiUrl } from "./config";

export const getHourlyUsage = async (
  { date, facilityId, zoneCode, signal } = {},
) => {
  const queryParams = new URLSearchParams();

  if (date) {
    queryParams.set("date", date);
  }

  if (facilityId) {
    queryParams.set("facility_id", facilityId);
  }

  if (zoneCode) {
    queryParams.set("zone_code", zoneCode);
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `${buildApiUrl("/metrics/hourly-usage/")}?${queryString}`
    : buildApiUrl("/metrics/hourly-usage/");

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch hourly usage (${response.status})`);
  }

  return response.json();
};
