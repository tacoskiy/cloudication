type QueryParams = Record<string, string | number | boolean | undefined>;

type ApiFetchOptions<TBody = unknown> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: HeadersInit;
  query?: QueryParams;

  // Next.js fetch 拡張をそのまま通す
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function buildQueryString(query?: QueryParams) {
  if (!query) return "";

  const qs = Object.entries(query)
    .filter(([, v]) => v !== undefined)
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");

  return qs ? `?${qs}` : "";
}

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options: ApiFetchOptions<TBody> = {}
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    headers,
    query,
    cache = "no-store",
    next,
  } = options;

  const queryString = buildQueryString(query);

  const isFormData = body instanceof FormData;
  const isJsonBody =
    body !== undefined &&
    !isFormData &&
    typeof body === "object";

  const res = await fetch(`${API_BASE_URL}${path}${queryString}`, {
    method,
    cache,
    next,
    headers: {
      ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isFormData
        ? body
        : isJsonBody
        ? JSON.stringify(body)
        : (body as BodyInit),
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
    const errorMessage =
      (data as any)?.error || `API request failed: ${res.status}`;
    throw new Error(errorMessage);
  }

  return data as TResponse;
}
