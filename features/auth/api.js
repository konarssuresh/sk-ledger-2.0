const jsonHeaders = {
  "Content-Type": "application/json",
};

async function parseResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = data?.error || response.statusText;
    throw new Error(message);
  }
  return data;
}

export async function signupRequest(body) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

export async function loginRequest(body) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

export async function googleLoginRequest(body) {
  const response = await fetch("/api/auth/login/google", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

export async function meRequest() {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });
  return parseResponse(response);
}

export async function signoutRequest() {
  const response = await fetch("/api/auth/signout", {
    method: "POST",
    credentials: "include",
  });
  return parseResponse(response);
}

export const meQueryKey = ["me"];
