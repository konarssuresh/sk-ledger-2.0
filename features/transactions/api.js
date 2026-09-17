async function parseResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.error || response.statusText;
    throw new Error(message);
  }
  return data;
}

const jsonHeaders = { "Content-Type": "application/json" };

export function monthSummaryKey(year, month) {
  return ["transactions", "month", year, month];
}

export function dayTransactionsKey(dateKey) {
  return ["transactions", "day", dateKey];
}

export async function fetchMonthlySummaryRequest({ year, month }) {
  const response = await fetch(
    `/api/transactions/month-summary?year=${year}&month=${month}`,
    { method: "GET", credentials: "include" },
  );
  return parseResponse(response);
}

export async function fetchTransactionsForDayRequest(dateKey) {
  const response = await fetch(`/api/transactions?date=${dateKey}`, {
    method: "GET",
    credentials: "include",
  });
  return parseResponse(response);
}

export async function createTransactionRequest(body) {
  const response = await fetch("/api/transactions/create", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

export async function updateTransactionRequest({ id, ...body }) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

export async function deleteTransactionRequest({ id }) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return parseResponse(response);
}

export function keysForTransactionDate(dateValue) {
  if (!dateValue) return { month: null, day: null };
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return { month: null, day: null };
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { month: monthSummaryKey(year, month), day: dayTransactionsKey(dateKey) };
}
