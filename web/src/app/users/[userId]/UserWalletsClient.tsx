"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestAirdrop, getBalance } from "@/lib/solana";
import { useGlobalContext } from "@/context/GlobalContext";
interface Wallet {
  _id: string;
  address: string;
}
interface User {
  _id: string;
  name: string;
}

export default function UserWalletsClient({
  user,
  wallets: initialWallets,
  addWallet,
}: {
  user: User;
  wallets: Wallet[];
  addWallet: () => Promise<void>;
}) {
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
  const { setUser, setWallet } = useGlobalContext();
  async function handleAddWallet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await addWallet();
    window.location.reload();
  }

  async function sendSolToWallet(address: string) {
    const amount = document.getElementById(
      `amount-${address}`
    ) as HTMLInputElement;

    await requestAirdrop(address, parseFloat(amount.value));
    const balance = await getBalance(address);
    alert(`Balance: ${balance} SOL`);
  }

  async function handleSetActiveWallet(address: string) {
    setUser(user.name);
    setWallet(address);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">{user.name}</h1>
      <form onSubmit={handleAddWallet} className="flex gap-2 mb-4">
        <Button type="submit">Add Wallet</Button>
      </form>
      <div className="rounded-md border mt-4">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-left font-medium">Address</th>
              <th className="h-10 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet._id} className="border-b">
                <td className="p-4 align-middle">
                  <span
                    className="cursor-pointer hover:text-blue-500 hover:underline"
                    onClick={() => handleSetActiveWallet(wallet.address)}
                    title="Set as active wallet"
                  >
                    {wallet.address}
                  </span>
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex justify-end gap-2">
                    <div className="flex items-center mr-2">
                      <input
                        type="text"
                        placeholder="Amount"
                        className="h-9 w-20 rounded-md border border-input px-3 py-1 text-sm"
                        id={`amount-${wallet.address}`}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await sendSolToWallet(wallet.address);
                        window.location.reload();
                      }}
                    >
                      Faucet SOL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await sendEuroccToWallet(wallet.address);
                        window.location.reload();
                      }}
                    >
                      Faucet EUROCC
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        // You would need to implement a function to get and display the balance
                        // For example, using the getBalance function from solana.ts
                        const balance = await getBalance(wallet.address);
                        alert(`Balance: ${balance} SOL`);
                      }}
                    >
                      Check SOL Balance
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
