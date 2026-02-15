import { buildApiUrl } from "./config";

export const getAlerts = async ({ status, severity, signal } = {}) => {
  const queryParams = new URLSearchParams();

  if (status) {
    queryParams.set("status", status);
  }

  if (severity) {
    queryParams.set("severity", severity);
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `${buildApiUrl("/alerts/")}?${queryString}`
    : buildApiUrl("/alerts/");

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch alerts (${response.status})`);
  }

  return response.json();
};

export const acknowledgeAlert = async ({ alertId, signal } = {}) => {
  if (!alertId) {
    throw new Error("alertId is required to acknowledge an alert");
  }

  const response = await fetch(buildApiUrl(`/alerts/${alertId}/ack/`), {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "ACKNOWLEDGED" }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to acknowledge alert (${response.status})`);
  }

  return response.json();
};

export const resolveAlert = async ({ alertId, signal } = {}) => {
  if (!alertId) {
    throw new Error("alertId is required to resolve an alert");
  }

  const response = await fetch(buildApiUrl(`/alerts/${alertId}/resolve/`), {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "ACKNOWLEDGED" }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to resolve alert (${response.status})`);
  }

  return response.json();
};
