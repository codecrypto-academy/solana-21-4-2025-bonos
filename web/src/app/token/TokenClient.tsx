"use client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { createTokenAction } from "./actions";

interface Token {
  _id: string;
  tipo: string;
  name: string;
  symbol: string;
  decimals: number;
  amount: number;
  walletAddress: string;
  mintAddress: string;
  nominal: number;
  porcentajeCupon: number;
  anos: number;
}

export default function TokenClient({ tokens }: { tokens: Token[] }) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("StableCoin");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(6);
  const [amount, setAmount] = useState(0);
  const [nominal, setNominal] = useState(0);
  const [porcentajeCupon, setPorcentajeCupon] = useState(0);
  const [anos, setAnos] = useState(0);
  const { wallet } = useGlobalContext();

  function resetForm() {
    setTipo("StableCoin");
    setName("");
    setSymbol("");
    setDecimals(6);
    setAmount(0);
    setNominal(0);
    setPorcentajeCupon(0);
    setAnos(0);
  }

  async function onCreateToken(e: React.FormEvent) {
    e.preventDefault();
    if (!wallet) return;
    await createTokenAction({ tipo, name, symbol, decimals, amount, walletAddress: wallet, nominal, porcentajeCupon, anos });
    setOpen(false);
    resetForm();
    window.location.reload();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Tokens</h1>
        <Button variant="default" onClick={() => setOpen(true)}>Crear Token</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Token</DialogTitle>
          </DialogHeader>
          <form onSubmit={onCreateToken} className="space-y-4">
            <div>
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="StableCoin">StableCoin</SelectItem>
                  <SelectItem value="Bono">Bono</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nombre</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <Label>Symbol</Label>
              <Input value={symbol} onChange={e => setSymbol(e.target.value)} required />
            </div>
            <div>
              <Label>Decimals</Label>
              <Input type="number" value={decimals} onChange={e => setDecimals(Number(e.target.value))} min={0} required />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} min={0} required />
            </div>
            {tipo === "Bono" && (
              <>
                <div>
                  <Label>Nominal</Label>
                  <Input type="number" value={nominal} onChange={e => setNominal(Number(e.target.value))} min={0} required />
                </div>
                <div>
                  <Label>Porcentaje Cupón</Label>
                  <Input type="number" value={porcentajeCupon} onChange={e => setPorcentajeCupon(Number(e.target.value))} min={0} step="0.01" required />
                </div>
                <div>
                  <Label>Años</Label>
                  <Input type="number" value={anos} onChange={e => setAnos(Number(e.target.value))} min={0} required />
                </div>
              </>
            )}
            <div>
              <Label>Wallet Address</Label>
              <Input value={wallet || ""} readOnly />
            </div>
            <DialogFooter>
              <Button type="submit">Crear</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Decimals</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Porcentaje Cupón</TableHead>
            <TableHead>Años</TableHead>
            <TableHead>Wallet Address</TableHead>
            <TableHead>Mint Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map(token => (
            <TableRow key={token._id}>
              <TableCell>{token.tipo}</TableCell>
              <TableCell>
                <a href={`/token/${token._id}`} className="text-blue-600 hover:underline">
                  {token.name}
                </a>
              </TableCell>
              <TableCell>{token.symbol}</TableCell>
              <TableCell>{token.decimals}</TableCell>
              <TableCell>{token.amount}</TableCell>
              <TableCell>{token.tipo === "Bono" ? token.nominal : "-"}</TableCell>
              <TableCell>{token.tipo === "Bono" ? token.porcentajeCupon : "-"}</TableCell>
              <TableCell>{token.tipo === "Bono" ? token.anos : "-"}</TableCell>
              <TableCell>
                <a href={`https://explorer.solana.com/address/${token.walletAddress}?cluster=custom`} target="_blank" rel="noopener noreferrer">
                  {token.walletAddress}
                </a>
              </TableCell>
              <TableCell>
                <a href={`https://explorer.solana.com/address/${token.mintAddress}?cluster=custom`} target="_blank" rel="noopener noreferrer">
                  {token.mintAddress}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 