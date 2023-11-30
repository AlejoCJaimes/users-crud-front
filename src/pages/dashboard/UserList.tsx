import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react"
import { Check, CloudXmark, EditPencil, LockSlash, Trash } from "iconoir-react"
import { useUsersContext } from "./UsersContext"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useState } from "react";
import { User } from "../../api/User";
import { getAuthData } from "../../api/getHeaders";

const SwalAlert = withReactContent(Swal);


const EditUser = (user: User) => {
  // const { saveUser } = useUsersContext();
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [newUser, setNewUser] = useState({
    fullname: user.fullname,
    username: user.username,
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const authData = getAuthData();
      console.log(newUser)
      const response = await fetch(`${API_URL}/api/v1/users/${user.id}?id=${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.accessToken}`,
        },
        body: JSON.stringify(newUser)
      });
      if (!response.ok) {
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
        title: 'Guardado',
        text: 'El usuario ha sido guardado',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      })
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <Button variant="flat" color="primary" onPress={onOpen} className="font-semibold" endContent={<EditPencil />} size="md" isIconOnly></Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">Nuevo usuario</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input type="text" placeholder="Nombre" label="Nombre" isRequired value={newUser.fullname} onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })} />
                  <Input type="text" placeholder="Username" label="Username" isRequired value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
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


const UserList = () => {
  const { users, deleteUserService, unlockUserService } = useUsersContext();

  const deleteUser = (id: number) => {
    SwalAlert.fire({
      title: '¿Estas seguro?',
      text: 'Una vez eliminado, no podras recuperar este usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUserService(id);
          SwalAlert.fire(
            'Eliminado',
            'El usuario ha sido eliminado',
            'success'
          )
        } catch (error) {
          SwalAlert.fire(
            'Error',
            "No se pudo eliminar el usuario",
            'error'
          )
        }
      }
    })
  }

  const unlockUser = (id: number, status: boolean) => {
    SwalAlert.fire({
      title: '¿Estas seguro?',
      text: status ? 'Una vez desbloqueado, el usuario podra iniciar sesion' : 'Una vez bloqueado, el usuario no podra iniciar sesion',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await unlockUserService(id);
          SwalAlert.fire(
            status ? 'Bloqueado' : 'Desbloqueado',
            `El usuario ha sido ${status ? 'bloqueado' : 'desbloqueado'}`,
            'success'
          )
        } catch (error) {
          SwalAlert.fire(
            'Error',
            `No se pudo ${status ? 'bloquear' : 'desbloquear'} el usuario`,
            'error'
          )
        }
      }
    })
  }

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Nombre</TableColumn>
        <TableColumn>Nombre de usuario</TableColumn>
        <TableColumn>Correo</TableColumn>
        <TableColumn>Esta autenticado</TableColumn>
        <TableColumn>Esta bloqueado</TableColumn>
        <TableColumn>Acciones</TableColumn>
      </TableHeader>
      <TableBody>
        {
          users.map((user) => {
            return (
              < TableRow key={user.id}>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{
                  user.is_authenticated ? <Check className="text-green-500" /> : <CloudXmark className="text-red-500" />
                }</TableCell>
                <TableCell>{
                  user.is_blocked ? <Check className="text-green-500" /> : <CloudXmark className="text-red-500" />
                }</TableCell>
                <TableCell className="flex h-full flex-row gap-2">
                  <EditUser {...user} />
                  {
                    user.is_blocked &&
                    <Button variant="light" color="primary" isIconOnly onPress={() => unlockUser(user.id ?? 0, user.is_blocked ?? false)}><LockSlash /></Button>
                  }
                  <Button variant="flat" color="danger" isIconOnly onPress={() => deleteUser(user.id ?? 0)}><Trash /></Button>
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table >
  )
}

export default UserList