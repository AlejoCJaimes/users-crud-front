import UserList from "./UserList"
import { UsersProvider } from "./UsersContext"
import UsersHeader from "./UsersHeader"

export const Users = () => {
  return (
    <UsersProvider>
      <UsersHeader />
      <div className="mt-4"></div>
      <UserList />
    </UsersProvider>
  )
}