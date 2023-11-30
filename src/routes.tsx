import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import Layout from "./components/Layout";
import { Users } from "./pages/dashboard/Users";
import { GuardUserIsAuth, PrivateRoute } from "./components/generics/PrivateRoutes";

const routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/dashboard/users",
            element: <Users />
          },
          {
            path: "/",
            element: <Users />
          },
        ]
      },
      {
        element: <GuardUserIsAuth />,
        children: [
          {
            path: "/auth/login",
            element: <Login />,
          },
        ]
      },
      {
        path: "*",
        element: <h1>Not found</h1>,
      }
    ]
  },
]);

export default routes;