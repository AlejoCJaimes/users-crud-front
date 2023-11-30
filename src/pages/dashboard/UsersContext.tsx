import React, { useEffect, useState } from "react";
import { User } from "../../api/User";
import { getAuthData } from "../../api/getHeaders";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalAlert = withReactContent(Swal);

interface ContextState {
  users: User[];
  deleteUserService: (id: number) => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  unlockUserService: (id: number) => Promise<void>;
}


export const UsersContext = React.createContext({} as ContextState);

export const UsersProvider = (
  { children }: React.PropsWithChildren
) => {
  const [users, setUsers] = useState<User[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const getUsers = async () => {
    const authData = getAuthData();
    const response = await fetch(`${API_URL}/api/v1/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData?.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      SwalAlert.fire({
        title: 'Error',
        text: error.detail,
        icon: 'error'
      });
      throw new Error(error.detail);
      return;
    } else {
      const data = await response.json();
      setUsers(data);
    }
  }

  async function deleteUserService(id: number) {
    const authData = getAuthData();
    const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData?.accessToken}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      SwalAlert.fire({
        title: 'Error',
        text: error.detail,
        icon: 'error'
      });
      throw new Error(error.detail);
    } else {
      getUsers();
    }

  }

  const saveUser = async (user: User) => {
    const authData = getAuthData();
    const response = await fetch(`${API_URL}/api/v1/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData?.accessToken}`,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const error = await response.json();
      SwalAlert.fire({
        title: 'Error',
        text: error.detail,
        icon: 'error'
      });
      // throw new Error(error.detail);
      return;
    } else {
      getUsers();
    }

  }

  const unlockUserService = async (id: number) => {
    const authData = getAuthData();
    const response = await fetch(`${API_URL}/api/v1/users/${id}?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData?.accessToken}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      SwalAlert.fire({
        title: 'Error',
        text: error.detail,
        icon: 'error'
      });
      throw new Error(error.detail);
    } else {
      getUsers();
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, deleteUserService, saveUser, unlockUserService }}>
      {children}
    </UsersContext.Provider>
  );

}

export const useUsersContext = () => React.useContext(UsersContext);



