"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WalletDetailWallet, WalletDetailToken } from "./page";
import { buyToken } from "@/lib/solana";

export default function WalletDetailClient({ wallet, tokens, balances, solBalance }: {
  wallet: WalletDetailWallet;
  tokens: WalletDetailToken[];
  balances: number[];
  solBalance: number;
}) {
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<WalletDetailToken | null>(null);
  const [stablecoinMint, setStablecoinMint] = useState("");
  const [amount, setAmount] = useState("");

  // Find all stablecoins in tokens
  const stablecoins = tokens.filter(t => t.tipo === "StableCoin");

  const handleOpenBuy = (token: WalletDetailToken) => {
    setSelectedToken(token);
    setBuyDialogOpen(true);
    setStablecoinMint("");
    setAmount("");
  };

  const handleBuy = async () => {
    // TODO: Implement buy logic
    if (!selectedToken) {
      alert("No se seleccionó un token");
      return;
    }
    await buyToken(wallet.address, stablecoinMint, selectedToken.mintAddress, parseFloat(amount));
    
    alert(`Comprar ${amount} de ${selectedToken?.name} usando stablecoin ${stablecoinMint}`);
    setBuyDialogOpen(false);
    window.location.reload();
    
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Detalle del Wallet</h1>
      <div className="mb-4">
        <strong>Dirección:</strong>
        <a href={`https://explorer.solana.com/address/${wallet.address}?cluster=custom`} target="_blank" rel="noopener noreferrer">
          {wallet.address}

        </a>
      </div>
      <div className="mb-4">
        <strong>Balance en SOL:</strong> {solBalance}
      </div>
      <h2 className="text-xl mb-2">Tokens</h2>
      {tokens.length === 0 ? (
        <div>No hay tokens en el sistema.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Símbolo</th>
              <th className="p-2 text-left">Mint Address</th>
              <th className="p-2 text-left">Decimals</th>
              <th className="p-2 text-left">Cantidad</th>
              <th className="p-2 text-left">Nominal</th>
              <th className="p-2 text-left">Porcentaje Cupón</th>
              <th className="p-2 text-left">Años</th>
              <th className="p-2 text-left">Balance</th>
              <th className="p-2 text-left">Comprar</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, i) => (
              <tr key={token._id} className="border-b">
                <td className="p-2">{token.name}</td>
                <td className="p-2">{token.symbol}</td>
                <td className="p-2">
                  <a href={`https://explorer.solana.com/address/${token.mintAddress}?cluster=custom`} target="_blank" rel="noopener noreferrer">
                    {token.mintAddress}
                  </a>
                </td>
                <td className="p-2">{token.decimals}</td>
                <td className="p-2">{token.amount}</td>
                <td className="p-2">{token.nominal}</td>
                <td className="p-2">{token.porcentajeCupon}</td>
                <td className="p-2">{token.anos}</td>
                <td className="p-2">{balances[i]}</td>
                <td className="p-2">
                  <Button onClick={() => handleOpenBuy(token)}>Comprar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comprar {selectedToken?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Stablecoin a usar</label>
              <Select value={stablecoinMint} onValueChange={setStablecoinMint}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona stablecoin" />
                </SelectTrigger>
                <SelectContent>
                  {stablecoins.length === 0 ? (
                    <SelectItem value="" disabled>No hay stablecoins</SelectItem>
                  ) : (
                    stablecoins.map((sc) => (
                      <SelectItem key={sc.mintAddress} value={sc.mintAddress}>
                        {sc.name} ({sc.symbol})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1">Cantidad</label>
              <Input
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Cantidad a comprar"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleBuy} disabled={!stablecoinMint || !amount || !selectedToken}>Comprar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 