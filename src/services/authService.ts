import { setUser } from "@/store/slices/userSlice";
import { Dispatch } from "redux";

export async function fetchCurrentSession(dispatch: Dispatch) {
  try {
    const res = await fetch("http://localhost:5123/api/Users/me", {
      credentials: "include",
    });

    if (res.ok) {
      const user = await res.json();
      dispatch(setUser(user));
    }
  } catch {
    dispatch(setUser(null));
  }
}

export async function loginRequest(email: string, password: string) {
  const response = await fetch("http://localhost:5123/api/Users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  return await response.json();
}

export async function logoutRequest(dispatch: Dispatch) {
  const res = await fetch("http://localhost:5123/api/Users/logout", {
    method: "POST",
    credentials: "include",
  });

  if (res.ok) {
    dispatch(setUser(null));
  } else {
    throw new Error("Logout failed");
  }
}

export const updateUserProfile = async (data: {
  name?: string;
  phone?: string;
  photoFileUrl?: string;
}) => {
  const response = await fetch("http://localhost:5123/api/Users/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error updating profile");
  }

  return await response.json();
};
