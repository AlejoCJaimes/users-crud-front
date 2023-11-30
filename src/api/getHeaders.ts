import { LoginResponse } from "./localstorage-sesion";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export function getAuthData(): AuthResponse | undefined {
  const loginResponseString = localStorage.getItem("loginResponse");
  if (!loginResponseString) return undefined;
  const loginResponse = JSON.parse(loginResponseString) as LoginResponse;
  if (!loginResponse) return undefined;
  return loginResponse.auth;
}

export function getHeaders() {
  const currentAuth = getAuthData();

  if (!currentAuth) {
    return {
      "Content-Type": "application/json",
    };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${currentAuth.accessToken}`,
  };
}