async function parseResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.error || response.statusText;
    throw new Error(message);
  }
  return data;
}

export function dashboardAnalyticsKey(periodType, date) {
  return ["analytics", "dashboard", periodType, date];
}

export async function fetchDashboardAnalyticsRequest({ periodType, date }) {
  const params = new URLSearchParams();
  if (periodType) params.set("periodType", periodType);
  if (date) params.set("date", date);
  const response = await fetch(`/api/analytics/dashboard?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });
  return parseResponse(response);
}
