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
  const found = await users.findOne({ name: user });
  if (!found || found.password !== password) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, _id: found._id, name: found.name });
} 