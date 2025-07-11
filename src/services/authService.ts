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

export const signUpUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
) => {
  try {
    const response = await fetch("http://localhost:5123/api/Users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password,
        name,
        phone,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Sign up failed");
    }

    const data = await response.json();
    return data;
  } catch {
    throw new Error("Error occurred during sign-up");
  }
};

export const confirmSignUp = async (
  email: string,
  confirmationCode: string,
) => {
  const response = await fetch(
    "http://localhost:5123/api/Users/confirm-signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        code: confirmationCode.trim(),
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Error en la confirmación. Verifique el código.");
  }

  return await response.json();
};

export const resendConfirmationCode = async (email: string): Promise<void> => {
  const response = await fetch("http://localhost:5123/api/Users/resend-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });

  if (!response.ok) {
    throw new Error("Error al reenviar el código.");
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const response = await fetch(
    "http://localhost:5123/api/users/change-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to change password.");
  }

  return await response.json();
};

export const sendRestoreCode = async (email: string) => {
  const response = await fetch(
    "http://localhost:5123/api/users/forgot-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );

  if (!response.ok) throw new Error("No se pudo enviar el código");

  return await response.json();
};

export const confirmRestorePassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  const response = await fetch(
    "http://localhost:5123/api/users/confirm-forgot-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    },
  );

  if (!response.ok) throw new Error("No se pudo confirmar el código");

  return await response.json();
};
