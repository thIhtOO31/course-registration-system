// Central API client for the CRS backend.
// In development, VITE_API_URL is left empty so /api/* calls are handled by
// the Vite proxy (vite.config.js → server.proxy), which forwards them to
// http://localhost:3000 — no CORS issues.
// In production, set VITE_API_URL to the deployed backend URL.

const BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Thin wrapper around fetch that:
 *  - always prefixes /api
 *  - attaches the stored JWT token as a Bearer token
 *  - parses the JSON body and throws for non-2xx responses
 */
async function request(method, path, body) {
  const token = localStorage.getItem("crs_token");

  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * POST /api/auth/login
   * Returns { success, token, user }
   */
  login: (email, password) =>
    request("POST", "/auth/login", { email, password }),

  /**
   * GET /api/auth/me   (requires valid JWT)
   * Returns { success, user }
   */
  getMe: () => request("GET", "/auth/me"),
};

export default { authApi };
