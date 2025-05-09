"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestAirdrop, getBalance, airdropSplTokenAction, getTokenBalance } from "@/lib/solana";
import { useGlobalContext } from "@/context/GlobalContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";


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
  const [wallets] = useState<Wallet[]>(initialWallets);
  const { setUser, setWallet } = useGlobalContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const [splAmount, setSplAmount] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [balanceMintAddress, setBalanceMintAddress] = useState("");
  const [balanceResult, setBalanceResult] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceWallet, setBalanceWallet] = useState<string | null>(null);
  const [faucetSolDialogOpen, setFaucetSolDialogOpen] = useState(false);
  const [faucetSolWallet, setFaucetSolWallet] = useState<string | null>(null);
  const [faucetSolAmount, setFaucetSolAmount] = useState(0);
  const [faucetSolLoading, setFaucetSolLoading] = useState(false);

  async function handleAddWallet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await addWallet();
    window.location.reload();
  }

  async function handleSetActiveWallet(address: string) {
    setUser(user.name);
    setWallet(address);
  }

  async function handleFaucetEurocc(address: string) {
    setSelectedWallet(address);
    setDialogOpen(true);
  }

  async function handleAirdropSPL() {
    if (!selectedWallet || !mintAddress || !splAmount) return;
    await airdropSplTokenAction(selectedWallet, mintAddress, splAmount);
    setDialogOpen(false);
    const balance = await getTokenBalance(mintAddress, selectedWallet);
    alert(`Balance: ${balance}`);
  }

  async function handleFaucetTokenBalance(address: string) {
    setBalanceWallet(address);
    setBalanceMintAddress("");
    setBalanceResult(null);
    setBalanceDialogOpen(true);
  }

  async function handleCheckTokenBalance() {
    if (!balanceWallet || !balanceMintAddress) return;
    setBalanceLoading(true);
    try {
      const balance = await getTokenBalance(balanceMintAddress, balanceWallet);
      setBalanceResult(Number(balance));
    } catch (e) {
      alert("Error consultando balance: " + e);
    }
    setBalanceLoading(false);
  }

  function handleFaucetSol(walletAddress: string) {
    setFaucetSolWallet(walletAddress);
    setFaucetSolAmount(0);
    setFaucetSolDialogOpen(true);
  }

  async function handleSendSolAirdrop() {
    if (!faucetSolWallet || !faucetSolAmount) return;
    setFaucetSolLoading(true);
    try {
      await requestAirdrop(faucetSolWallet, faucetSolAmount);
      const balance = await getBalance(faucetSolWallet);
      alert(`Balance: ${balance} SOL`);
      setFaucetSolDialogOpen(false);
    } catch (e) {
      alert("Error en el airdrop: " + e);
    }
    setFaucetSolLoading(false);
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
                    <a href={`/users/${user._id}/wallets/${wallet._id}`} className="hover:underline text-blue-600">
                      {wallet.address}
                    </a>
                  </span>
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex justify-end gap-2">
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFaucetSol(wallet.address)}
                    >
                      Faucet SOL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFaucetEurocc(wallet.address)}
                    >
                      Faucet Token
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFaucetTokenBalance(wallet.address)}
                    >
                      Faucet Token Balance
                    </Button>
                  
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faucet SPL Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Token Mint Address" value={mintAddress} onChange={e => setMintAddress(e.target.value)} />
            <Input placeholder="Amount" type="number" value={splAmount} onChange={e => setSplAmount(Number(e.target.value))} />
          </div>
          <DialogFooter>
            <Button onClick={handleAirdropSPL}>
              Enviar Airdrop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Consultar Balance de Token SPL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Token Mint Address"
              value={balanceMintAddress}
              onChange={e => setBalanceMintAddress(e.target.value)}
            />
            <Button onClick={handleCheckTokenBalance} disabled={balanceLoading}>
              {balanceLoading ? "Consultando..." : "Consultar"}
            </Button>
            {balanceResult !== null && (
              <div>
                <strong>Balance:</strong> {balanceResult}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={faucetSolDialogOpen} onOpenChange={setFaucetSolDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faucet SOL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Amount"
              type="number"
              value={faucetSolAmount}
              onChange={e => setFaucetSolAmount(Number(e.target.value))}
            />
            <Button onClick={handleSendSolAirdrop} disabled={faucetSolLoading}>
              {faucetSolLoading ? "Enviando..." : "Enviar Airdrop"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
