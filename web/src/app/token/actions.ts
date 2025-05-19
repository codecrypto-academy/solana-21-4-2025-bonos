"use server";
import clientPromise from "@/lib/mongodb";
import { Keypair } from "@solana/web3.js";
import { createToken } from "@/lib/solana";
import { payCupon, payNominal } from "@/lib/solana";

interface TokenData {
  tipo: string;
  name: string;
  symbol: string;
  decimals: number;
  amount: number;
  walletAddress: string;
  nominal?: number;
  porcentajeCupon?: number;
  anos?: number;
}

export async function getTokens() {
  console.log("getTokens", process.env.MONGODB_URI);
  const client = await clientPromise;
  const db = client.db();
  const tokens = await db.collection("token").find().toArray();
  
  return tokens.map(t => ({
    _id: t._id.toString(),
    tipo: t.tipo,
    name: t.name,
    symbol: t.symbol,
    decimals: t.decimals,
    amount: t.amount,
    walletAddress: t.walletAddress,
    mintAddress: t?.mintAddress,
    nominal: t?.nominal,
    porcentajeCupon: t?.porcentajeCupon,
    anos: t?.anos,
  }));
}

export async function createTokenAction({ tipo, name, symbol, decimals, amount, walletAddress, nominal, porcentajeCupon, anos }: {
  tipo: string;
  name: string;
  symbol: string;
  decimals: number;
  amount: number;
  walletAddress: string;
  nominal?: number;
  porcentajeCupon?: number;
  anos?: number;
}) {
  if (!walletAddress) throw new Error("No wallet address");
  const client = await clientPromise;
  const db = client.db();
  const tokenData: TokenData = { tipo, name, symbol, decimals, amount, walletAddress };
  if (tipo === "Bono") {
    tokenData.nominal = nominal;
    tokenData.porcentajeCupon = porcentajeCupon;
    tokenData.anos = anos;
  }
  const token = await db.collection("token").insertOne(tokenData);
  // Get the private key from the wallet collection
  const wallet = await db.collection("wallets").findOne({ address: walletAddress });
  console.log("wallet", wallet);
  if (!wallet || !wallet.privateKey) {
    throw new Error("Wallet not found or private key missing");
  }
  
  const emisorToken = Keypair.fromSecretKey(Buffer.from(wallet.privateKey,'hex'));
    
  const mint = await createToken(
    emisorToken,
    name,
    symbol,
    decimals,
    amount
  );

  // Store the token mint address in MongoDB
  await db.collection("token").updateOne(
    { _id: token.insertedId },
    { $set: { mintAddress: mint.toString() } }
  );

  return { success: true, message: `Token ${symbol} created successfully` };
}

export async function cleanTokens() {
  "use server";
  const client = await clientPromise;
  const db = client.db();
  await db.collection("token").deleteMany({});
  await db.collection("wallets").deleteMany({});
  await db.collection("users").deleteMany({});
  return { success: true };
}

export async function payCuponAction(mintAddress: string) {
  'use server';
  return await payCupon(mintAddress);
} 

export async function payNominalAction(mintAddress: string) {
  'use server';
  return await payNominal(mintAddress);
} 