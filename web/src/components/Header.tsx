"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useGlobalContext } from "../context/GlobalContext";
import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { cleanTokens } from "../app/token/actions";

export function Header() {
  const { user, wallet, setUser, setWallet, userId, setUserId } = useGlobalContext();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    setUser(null);
    setWallet(null);
    setUserId(null);  
  };

  const handleClean = async () => {
    startTransition(async () => {
      await cleanTokens();
      window.location.reload();
    });
  };

  return (
    <header className="w-full flex justify-between items-center p-4 border-b">
      <Link href="/">
        <span className="font-bold">Bonos Deuda</span>
      </Link>
      <nav>
        {/* <Link href="/users">
          <Button variant="outline">Users</Button>
        </Link> */}
        <Link href="/token" className="ml-2">
          <Button variant="outline">Token</Button>
        </Link>
        {user && (
          <Link href={`/users/${userId}`} className="ml-2">
            <Button variant="outline">Mis Wallets</Button>
          </Link>
        )}
        <Button
          className="ml-2"
          variant="secondary"
          onClick={handleClean}
          disabled={isPending}
        >
          {isPending ? "Cleaning..." : "Clean"}
        </Button>
      </nav>
      <div className="flex flex-col items-end ml-4 text-xs">
        <span>
          <b>User:</b> {user || "-"}
        </span>
        <span>
          <b>Wallet:</b> 
          {wallet ? <a href={`https://explorer.solana.com/address/${wallet}?cluster=custom`} target="_blank" rel="noopener noreferrer">
            {wallet}
          </a> : "-"}
        </span>
        <div className="flex mt-2 gap-2">
          {!user && (
            <>
              <Button size="sm" onClick={() => setShowRegister(true)}>
                Register
              </Button>
              <Button size="sm" onClick={() => setShowLogin(true)}>
                Login
              </Button>
            </>
          )}
          {user && (
            <Button size="sm" variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  const { setUser, setWalletId } = useGlobalContext();
  const [user, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setUser(user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Register</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            className="border p-2 rounded"
            placeholder="User"
            value={user}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <button
            className="bg-blue-600 text-white rounded p-2 mt-2 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Register"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const { setUser, setUserId } = useGlobalContext();
  const [user, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setUser(user);
      localStorage.setItem('userId', data._id);
      localStorage.setItem('user', user);
      setUserId(data._id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Login</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            className="border p-2 rounded"
            placeholder="User"
            value={user}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <button
            className="bg-blue-600 text-white rounded p-2 mt-2 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
