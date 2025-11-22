import { setUser } from "@/store/slices/userSlice";
import { Dispatch } from "redux";
import { trackEvent } from "./logEvent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_USERS_URL ?? "";

export async function fetchCurrentSession(dispatch: Dispatch) {
  try {
    const res = await fetch(`${API_BASE}/api/Users/me`, {
      credentials: "include",
    });

    if (res.ok) {
      const user = await res.json();
      dispatch(setUser(user));

      trackEvent("session_fetch_success");
    } else trackEvent("session_fetch_failed");
  } catch {
    dispatch(setUser(null));
  }
}

export async function loginRequest(email: string, password: string) {
  let fcmToken = null;

  if (typeof window !== "undefined") {
    const { getFcmToken } = await import("@/utils/firebase");
    fcmToken = await getFcmToken();
  }

  const resp = await fetch(`${API_BASE}/api/Users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      fcmToken,
      deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "",
    }),
  });

  if (!resp.ok) {
    trackEvent("login_failed", { email });
    throw new Error("Credenciales inválidas");
  }

  trackEvent("login_success", { email });
  return await resp.json();
}

export async function logoutRequest(dispatch: Dispatch) {
  const res = await fetch(`${API_BASE}/api/Users/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (res.ok) {
    trackEvent("logout_success");
    dispatch(setUser(null));
  } else {
    trackEvent("logout_failed");
    throw new Error("Logout failed");
  }
}

export const updateUserProfile = async (data: {
  name?: string;
  phone?: string;
  photoFileUrl?: string;
}) => {
  const response = await fetch(`${API_BASE}/api/Users/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    trackEvent("profile_update_failed");
    throw new Error("Error updating profile");
  }
  trackEvent("profile_update_success");

  return await response.json();
};

export const signUpUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
) => {
  try {
    const response = await fetch(`${API_BASE}/api/Users/signup`, {
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
      trackEvent("signup_failed", { email });
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Sign up failed");
    }

    const data = await response.json();
    trackEvent("signup_success", { email });

    return data;
  } catch {
    throw new Error("Error occurred during sign-up");
  }
};

export const confirmSignUp = async (
  email: string,
  confirmationCode: string,
) => {
  const response = await fetch(`${API_BASE}/api/Users/confirm-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim(),
      code: confirmationCode.trim(),
    }),
  });

  if (!response.ok) {
    trackEvent("signup_confirm_failed", { email });
    throw new Error("Error en la confirmación. Verifique el código.");
  }

  trackEvent("signup_confirm_success", { email });

  return await response.json();
};

export const resendConfirmationCode = async (email: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/Users/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });

  if (!response.ok) {
    trackEvent("signup_resend_code_failed", { email });
    throw new Error("Error al reenviar el código.");
  }

  trackEvent("signup_resend_code_success", { email });
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const response = await fetch(`${API_BASE}/api/Users/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    trackEvent("password_change_failed");
    throw new Error("Failed to change password.");
  }

  trackEvent("password_change_success");

  return await response.json();
};

export const sendRestoreCode = async (email: string) => {
  const response = await fetch(`${API_BASE}/api/Users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    trackEvent("password_restore_code_failed", { email });
    throw new Error("No se pudo enviar el código");
  }

  trackEvent("password_restore_code_success", { email });

  return await response.json();
};

export const confirmRestorePassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  const response = await fetch(
    `${API_BASE}/api/Users/confirm-forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    },
  );

  if (!response.ok) {
    trackEvent("password_restore_confirm_failed", { email });
    throw new Error("No se pudo confirmar el código");
  }

  trackEvent("password_restore_confirm_success", { email });

  return await response.json();
};

export type UserDTO = {
  publicId: string;
  name: string;
  email: string;
  phone: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  role: string;
  photoFileUrl?: string;
  verified: boolean;
  bankPaymentData?: {
    bankAccountNumber: string;
    bankAccountHolder: string;
    bankName: string;
  };
};

export async function getUserByPublicId(
  publicId: string,
  signal?: AbortSignal,
): Promise<UserDTO> {
  const res = await fetch(`${API_BASE}/api/Users/${publicId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    trackEvent("user_fetch_failed", { publicId });
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status} al obtener el usuario`);
  }
  trackEvent("user_fetch_success", { publicId });
  return res.json() as Promise<UserDTO>;
}
