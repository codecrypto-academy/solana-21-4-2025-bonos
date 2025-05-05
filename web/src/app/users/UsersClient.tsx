"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
}

export default function UsersClient({
  users: initialUsers,
  addUser,
}: {
  users: User[];
  addUser: (formData: FormData) => Promise<void>;
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  async function handleAddUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addUser(formData);
    window.location.reload();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Users</h1>
      <form onSubmit={handleAddUser} className="flex gap-2 mb-4">
        <input name="name" className="border px-2 py-1" placeholder="New user name" required />
        <Button type="submit">Add</Button>
      </form>
      <ul className="mt-4">
        {users.map(user => (
          <li key={user._id}>
            <Link href={`/users/${user._id}`}>
              <Button variant="link">{user.name}</Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 