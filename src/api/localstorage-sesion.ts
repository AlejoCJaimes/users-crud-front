import { User } from "./User";

export interface LoginResponse {
  user: User;
  auth: {
    accessToken: string;
    refreshToken: string;
  };
}

export function saveSessionInStorage({
  loginResponse,
}: {
  loginResponse: LoginResponse;
}) {
  const loginResponseString = JSON.stringify(loginResponse);
  localStorage.setItem("loginResponse", loginResponseString);
}