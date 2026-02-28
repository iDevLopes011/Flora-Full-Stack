import { fetchWithAuth } from "./fetchWithAuth";

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8000`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

const API_BASE_URL = getApiUrl();

export interface EntryParams {
  limit?: number;
  page?: number;
  search?: string;
}

export interface WordListResponse {
  results: string[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface WordHistoryListResponse {
  results: { word: string; added: string }[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface WordDetailsResponse {
  word: string;
  phonetic: string | null;
  origin: string | null;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export async function fetchWords(
  params?: EntryParams,
): Promise<WordListResponse> {
  const url = new URL(`${API_BASE_URL}/entries/en`);

  if (params?.limit) url.searchParams.append("limit", params.limit.toString());
  if (params?.page) url.searchParams.append("page", params.page.toString());
  if (params?.search) url.searchParams.append("search", params.search);

  const response = await fetchWithAuth(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Não autorizado. Por favor, faça login.");
    }
    throw new Error(`Erro ao buscar palavras: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchWordDetails(
  word: string,
): Promise<WordDetailsResponse> {
  const url = `${API_BASE_URL}/entries/en/${encodeURIComponent(word)}`;

  const response = await fetchWithAuth(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      return {
        word: decodeURIComponent(word),
        phonetic: null,
        origin: null,
        meanings: [],
      };
    }
    throw new Error(`Erro ao buscar palavra: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function fetchHistory(
  params?: EntryParams,
): Promise<WordHistoryListResponse> {
  const url = new URL(`${API_BASE_URL}/user/me/history`);

  if (params?.limit) url.searchParams.append("limit", params.limit.toString());
  if (params?.page) url.searchParams.append("page", params.page.toString());

  const response = await fetchWithAuth(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Não autorizado. Por favor, faça login.");
    }
    throw new Error(`Erro ao buscar histórico: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchFavorites(
  params?: EntryParams,
): Promise<WordHistoryListResponse> {
  const url = new URL(`${API_BASE_URL}/user/me/favorites`);

  if (params?.limit) url.searchParams.append("limit", params.limit.toString());
  if (params?.page) url.searchParams.append("page", params.page.toString());

  const response = await fetchWithAuth(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Não autorizado. Por favor, faça login.");
    }
    throw new Error(`Erro ao buscar favoritos: ${response.statusText}`);
  }

  return response.json();
}

export async function favoriteWord(word: string): Promise<void> {
  const url = `${API_BASE_URL}/entries/en/${encodeURIComponent(word)}/favorite`;

  const response = await fetchWithAuth(url, {
    method: "POST",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Não autorizado. Por favor, faça login.");
    }
    throw new Error(`Erro ao salvar favorito: ${response.statusText}`);
  }
}

export async function unfavoriteWord(word: string): Promise<void> {
  const url = `${API_BASE_URL}/entries/en/${encodeURIComponent(word)}/unfavorite`;

  const response = await fetchWithAuth(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Não autorizado. Por favor, faça login.");
    }
    throw new Error(`Erro ao remover favorito: ${response.statusText}`);
  }
}
