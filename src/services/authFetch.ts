let isRefreshing = false;

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
    const refreshRes = await fetch("http://localhost:5123/api/Users/refresh", {
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
