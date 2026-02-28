import { getToken, refreshAccessToken } from "./auth";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = getToken();

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const firstResponse = await fetch(input, { ...init, headers });

  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken().finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  }

  const newToken = await refreshPromise;

  if (!newToken) {
    return firstResponse;
  }

  const retryHeaders = new Headers(init?.headers);
  retryHeaders.set("Authorization", `Bearer ${newToken}`);
  if (!retryHeaders.has("Content-Type") && !(init?.body instanceof FormData)) {
    retryHeaders.set("Content-Type", "application/json");
  }

  return fetch(input, { ...init, headers: retryHeaders });
}
