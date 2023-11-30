import { Navigate, Outlet } from "react-router-dom";

function checkUserIsAuth(): boolean {
  const loginResponseString = localStorage.getItem("loginResponse");
  if (!loginResponseString) return false;
  const loginResponse = JSON.parse(loginResponseString);
  if (!loginResponse) return false;
  return true;
}


export const PrivateRoute = () => {
  return checkUserIsAuth() ? <Outlet /> : <Navigate to="/auth/login" />;
};

export const GuardUserIsAuth = () => {
  return checkUserIsAuth() ? <Navigate to="/" /> : <Outlet />;
};
