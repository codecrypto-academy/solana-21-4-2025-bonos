"use server";
import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection("users").find().toArray();
  return users.map(u => ({ _id: u._id.toString(), name: u.name }));
}

export async function addUser(formData: FormData) {
  const name = formData.get("name");
  if (!name) return;
  const client = await clientPromise;
  const db = client.db();
  await db.collection("users").insertOne({ name });
  revalidatePath("/users");
} 