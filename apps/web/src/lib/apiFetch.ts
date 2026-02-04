type ApiFetchOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  query?: Record<string, string | number | boolean | undefined>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const { method = "GET", body, headers, cache = "no-store", query } = options;

  const queryString = query
    ? "?" +
      Object.entries(query)
        .filter(([, v]) => v !== undefined)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join("&")
    : "";

  const res = await fetch(`${API_BASE_URL}${path}${queryString}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    console.error("API Error", {
      url: path,
      status: res.status,
      data,
    });
    throw new Error(`API request failed: ${res.status}`);
  }

  return data;
}
