import Cookies from "js-cookie";

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8000`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

const API_BASE_URL = getApiUrl();

export const COOKIE_TOKEN = "flora_token";
export const COOKIE_REFRESH = "flora_refresh";
export const COOKIE_USER = "flora_user";

export interface AuthResponse {
  token: string;
  refreshToken: string;
  id: string;
  name: string;
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Credenciais inválidas.");
  }

  const data = await response.json();

  if (typeof window !== "undefined" && data.token) {
    Cookies.set(COOKIE_TOKEN, data.token, { expires: 1, path: "/" });
    Cookies.set(COOKIE_REFRESH, data.refreshToken, { expires: 7, path: "/" });
    Cookies.set(COOKIE_USER, JSON.stringify({ id: data.id, name: data.name }), {
      expires: 7,
      path: "/",
    });
  }

  return data;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao criar conta.");
  }

  const data = await response.json();

  if (typeof window !== "undefined" && data.token) {
    Cookies.set(COOKIE_TOKEN, data.token, { expires: 1, path: "/" });
    Cookies.set(COOKIE_REFRESH, data.refreshToken, { expires: 7, path: "/" });
    Cookies.set(COOKIE_USER, JSON.stringify({ id: data.id, name: data.name }), {
      expires: 7,
      path: "/",
    });
  }

  return data;
}

export function logout() {
  if (typeof window !== "undefined") {
    Cookies.remove(COOKIE_TOKEN, { path: "/" });
    Cookies.remove(COOKIE_REFRESH, { path: "/" });
    Cookies.remove(COOKIE_USER, { path: "/" });

    Cookies.remove("@flora:token", { path: "/" });
    Cookies.remove("@flora:refreshToken", { path: "/" });
    Cookies.remove("@flora:user", { path: "/" });
    window.location.href = "/signin";
  }
}

export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return Cookies.get(COOKIE_REFRESH) || null;
  }
  return null;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const data = await response.json();
    Cookies.set(COOKIE_TOKEN, data.accessToken, { expires: 1, path: "/" });
    Cookies.set(COOKIE_REFRESH, data.refreshToken, { expires: 7, path: "/" });
    return data.accessToken;
  } catch {
    logout();
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return Cookies.get(COOKIE_TOKEN) || null;
  }
  return null;
}

export function getUser() {
  if (typeof window !== "undefined") {
    const userStr = Cookies.get(COOKIE_USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}
