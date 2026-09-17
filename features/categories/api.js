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

export const categoriesQueryKey = ["categories"];

export async function fetchCategoriesRequest() {
  const response = await fetch("/api/categories", {
    method: "GET",
    credentials: "include",
  });
  return parseResponse(response);
}

export async function createCategoryRequest(body) {
  const response = await fetch("/api/categories/create", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}
