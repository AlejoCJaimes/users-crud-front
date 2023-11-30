import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { ArrowRight, Key } from "iconoir-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import { getAuthData } from "../api/getHeaders";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const SwalAlert = withReactContent(Swal);

function checkUserIsAuth(): boolean {
  const loginResponseString = localStorage.getItem("loginResponse");
  if (!loginResponseString) return false;
  const loginResponse = JSON.parse(loginResponseString);
  if (!loginResponse) return false;
  return true;
}

const ChangePassword = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [newCredentials, setNewCredentials] = useState({
    new_password: "",
    confirm_password: ""
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const authData = getAuthData();
      const response = await fetch(`${API_URL}/api/v1/auth/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.accessToken}`,
        },
        body: JSON.stringify(newCredentials)
      });

      if(!response.ok){
        const error = await response.json();
        SwalAlert.fire({
          title: 'Error',
          text: error.detail,
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        })
        return;
      }

      SwalAlert.fire({
        title: 'Exito',
        text: "La contrasena ha sido cambiada",
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("loginResponse");
          window.location.reload();
        }
      })
      onClose();
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <Button variant="flat" color="primary" onPress={onOpen} className="font-semibold" endContent={<Key />} size="md">Cambiar contrasena</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">Cambiar contrasena</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input type="password" placeholder="Password" label="Password" isRequired value={newCredentials.new_password} onChange={(e) => setNewCredentials({ ...newCredentials, new_password: e.target.value })} />
                  <Input type="password" placeholder="Confirmar password" label="Confirmar password" isRequired value={newCredentials.confirm_password} onChange={(e) => setNewCredentials({ ...newCredentials, confirm_password: e.target.value })} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Guardar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

const Layout = () => {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("loginResponse");
    navigate("/auth/login");
  }

  return (
    <main className="flex w-full flex-col items-center pl-20 gap-20 pr-20 bg-gradient-to-br from-cyan-100 to-rose-100 min-h-screen">
      <header className="w-1/2 pt-10 flex flex-row justify-between">
        <h1 className="text-4xl font-bold text-center text-gray-800">Users crud</h1>
        <div className="flex flex-row gap-2">
          {
            checkUserIsAuth() && (
              <>
                <ChangePassword />
                <Button variant="flat" color="danger" className="ml-auto" onPress={logout} endContent={<ArrowRight />}>Cerrar sesión</Button>
              </>
            )
          }
        </div>
      </header>
      <div className="w-1/2">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout