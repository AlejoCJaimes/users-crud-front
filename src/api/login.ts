import { saveSessionInStorage } from "./localstorage-sesion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalAlert = withReactContent(Swal);

export interface LoginPayload {
  username: string;
  password: string;
}

export async function login(data: LoginPayload) {
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_URL}/api/v1/auth/login/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    SwalAlert.fire({
      title: "Error",
      text: errorResponse.detail,
      icon: "error",
      confirmButtonText: "Ok",
    });
    throw new Error(errorResponse.detail);
  }

  const loginResponse = await response.json();
  saveSessionInStorage({ loginResponse });
  return loginResponse;

}