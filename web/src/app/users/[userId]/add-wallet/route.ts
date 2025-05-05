import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const formData = await request.formData();
  const address = formData.get("address");
  if (!address) return NextResponse.json({ ok: false, error: "Address required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  await db.collection("wallets").insertOne({ userId: params.userId, address });
  return NextResponse.redirect(`/users/${params.userId}`);
} 