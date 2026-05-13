const API_BASE = "/api/v1";

export const AUTH_TOKEN_KEY = "agenda_do_vale_token";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type QueryValue = string | number | boolean | null | undefined;

function buildQuery(params?: Record<string, QueryValue>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.append(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, query, signal }: RequestOptions = {},
): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${API_BASE}${path}${buildQuery(query)}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => "");

  if (!response.ok) {
    let message: string | undefined;

    if (isJson && payload && typeof payload === "object") {
      const obj = payload as {
        message?: unknown;
        title?: unknown;
        errors?:
          | Array<{ property?: string; message?: string }>
          | Record<string, string[]>;
      };

      let validationErrors = "";

      if (Array.isArray(obj.errors)) {
        // Formato custom do middleware: [{ property, message }]
        validationErrors = obj.errors
          .map((e) => e?.message)
          .filter((m): m is string => !!m)
          .join(" · ");
      } else if (obj.errors && typeof obj.errors === "object") {
        // Formato ValidationProblemDetails do ASP.NET: { field: [msgs] }
        validationErrors = Object.values(obj.errors)
          .flat()
          .filter((m): m is string => typeof m === "string" && !!m)
          .join(" · ");
      }

      message =
        validationErrors ||
        (obj.message ? String(obj.message) : undefined) ||
        (obj.title ? String(obj.title) : undefined);
    } else if (typeof payload === "string" && payload) {
      message = payload;
    }

    throw new ApiError(response.status, message || `Erro ${response.status}`, payload);
  }

  return payload as T;
}
