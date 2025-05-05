"use server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { Keypair } from "@solana/web3.js";

export async function getUserAndWallets(userId: string) {
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  const wallets = await db.collection("wallets").find({ userId }).toArray();
  return {
    user: user ? { _id: user._id.toString(), name: user.name } : null,
    wallets: wallets.map(w => ({ _id: w._id.toString(), address: w.address })),
  };
}

export async function addWallet(userId: string) {
  // Generar clave privada y pública de Solana
  const keypair = Keypair.generate();
  const privateKey = Buffer.from(keypair.secretKey).toString("hex");
  const address = keypair.publicKey.toBase58();

  const client = await clientPromise;
  const db = client.db();
  await db.collection("wallets").insertOne({
    userId,
    address,
    privateKey,
  });
  revalidatePath(`/users/${userId}`);
} 