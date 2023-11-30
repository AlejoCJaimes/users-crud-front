import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { Plus } from "iconoir-react"
import { useState } from "react";
import { useUsersContext } from "./UsersContext";


const NewUserModal = () => {
  const { saveUser } = useUsersContext();
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [newUser, setNewUser] = useState({
    fullname: '',
    email: '',
    password_hash: '',
    username: ''
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await saveUser(newUser);
      onClose();
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <Button variant="flat" color="primary" onPress={onOpen} className="font-semibold" endContent={<Plus />} size="md">Agregar</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">Nuevo usuario</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input type="text" placeholder="Nombre" label="Nombre" isRequired value={newUser.fullname} onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })} />
                  <Input type="text" placeholder="Username" label="Username" isRequired value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
                  <Input type="email" placeholder="Email" label="Email" isRequired value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                  <Input type="password" placeholder="Password" label="Password" isRequired value={newUser.password_hash} onChange={(e) => setNewUser({ ...newUser, password_hash: e.target.value })} />
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

const UsersHeader = () => {

  return (
    <header className="flex flex-row justify-between">
      <h2 className="text-2xl font-semibold">Usuarios</h2>
      
      <NewUserModal />
    </header>
  )
}

export default UsersHeader