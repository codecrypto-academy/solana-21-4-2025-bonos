import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { user, password } = await req.json();
  if (!user || !password) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");
  const exists = await users.findOne({ name: user });
  if (exists) {
    return NextResponse.json({ error: "Usuario ya existe" }, { status: 409 });
  }
  await users.insertOne({ name: user, password });
  return NextResponse.json({ ok: true });
} 