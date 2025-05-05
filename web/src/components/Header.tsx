"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useGlobalContext } from "../context/GlobalContext";

export function Header() {
  const { user, wallet } = useGlobalContext();
  return (
    <header className="w-full flex justify-between items-center p-4 border-b">
      <Link href="/">
        <span className="font-bold">Mi App</span>
      </Link>
      <nav>
        <Link href="/users">
          <Button variant="outline">Users</Button>
        </Link>
      </nav>
      <div className="flex flex-col items-end ml-4 text-xs">
        <span><b>User:</b> {user || '-'}</span>
        <span><b>Wallet:</b> {wallet ? wallet : '-'}</span>
      </div>
    </header>
  );
} 