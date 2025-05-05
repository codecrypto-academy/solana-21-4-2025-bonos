import { getUsers, addUser } from "./actions";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const users = await getUsers();
  return <UsersClient users={users} addUser={addUser} />;
} 