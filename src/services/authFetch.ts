let isRefreshing = false;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_USERS_URL ?? "";

export async function authFetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  let res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401 && !isRefreshing) {
    isRefreshing = true;
    const refreshRes = await fetch(`${API_BASE}/api/Users/refresh`, {
      method: "POST",
      credentials: "include",
    });
    isRefreshing = false;

    if (refreshRes.ok) {
      res = await fetch(input, {
        ...init,
        credentials: "include",
      });
    }
  }

  return res;
}
