const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {

  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

if (response.status === 401) {
    localStorage.removeItem("token");

    window.location.href = "/login";
  }

  return response;
}