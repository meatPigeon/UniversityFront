const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8083";

// Dev-mode StrictMode can trigger duplicate mount/effects, which can cause
// multiple identical GETs in-flight at once. Deduping identical GETs avoids
// hammering a backend that can't handle concurrent queries on the same conn.
const inflightGetRequests = new Map<string, Promise<unknown>>();

class ApiError extends Error {
  status: number;
  method: string;
  url: string;
  bodyText?: string;

  constructor(args: {
    status: number;
    message: string;
    method: string;
    url: string;
    bodyText?: string;
  }) {
    const { status, message, method, url, bodyText } = args;
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.method = method;
    this.url = url;
    this.bodyText = bodyText;
  }
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const method = (options.method || "GET").toUpperCase();
  const url = `${API_BASE_URL}${endpoint}`;

  // Only dedupe GET requests without an AbortSignal.
  if (method === "GET" && !options.signal) {
    const key = `${method} ${url}`;
    const existing = inflightGetRequests.get(key) as Promise<T> | undefined;
    if (existing) return existing;

    const p = (async () => {
      let response: Response;
      try {
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        throw new ApiError({
          status: 0,
          message: `Network error calling ${method} ${url}: ${detail}`,
          method,
          url,
        });
      }

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        const parsed = bodyText ? safeJsonParse(bodyText) : null;

        const messageFromJson =
          parsed && typeof parsed === "object"
            ? (parsed as Record<string, unknown>).message ??
              (parsed as Record<string, unknown>).error ??
              (parsed as Record<string, unknown>).detail
            : null;

        const message =
          typeof messageFromJson === "string" && messageFromJson.trim()
            ? messageFromJson.trim()
            : bodyText.trim()
              ? bodyText.trim().slice(0, 300)
              : `Request failed with status ${response.status}`;

        throw new ApiError({
          status: response.status,
          message: `${method} ${url}: ${message}`,
          method,
          url,
          bodyText: bodyText || undefined,
        });
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    })();

    inflightGetRequests.set(key, p as Promise<unknown>);
    try {
      return await p;
    } finally {
      inflightGetRequests.delete(key);
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new ApiError({
      status: 0,
      message: `Network error calling ${method} ${url}: ${detail}`,
      method,
      url,
    });
  }

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    const parsed = bodyText ? safeJsonParse(bodyText) : null;

    // Try a few common shapes: { message }, { error }, { detail }
    const messageFromJson =
      parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>).message ??
          (parsed as Record<string, unknown>).error ??
          (parsed as Record<string, unknown>).detail
        : null;

    const message =
      typeof messageFromJson === "string" && messageFromJson.trim()
        ? messageFromJson.trim()
        : bodyText.trim()
          ? bodyText.trim().slice(0, 300)
          : `Request failed with status ${response.status}`;

    throw new ApiError({
      status: response.status,
      message: `${method} ${url}: ${message}`,
      method,
      url,
      bodyText: bodyText || undefined,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

export { ApiError };
