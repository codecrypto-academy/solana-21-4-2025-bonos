"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { payCuponAction } from "../actions";

export default function TokenPayCuponClient({ mintAddress }: { mintAddress: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePayCupon() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await payCuponAction(mintAddress);
      setResult(typeof res === "string" ? res : JSON.stringify(res));
    } catch (e: unknown) {
      if (e && typeof e === "object" && "message" in e) {
        setError((e as { message: string }).message || "Error ejecutando payCupon");
      } else {
        setError("Error ejecutando payCupon");
      }
    }
    setLoading(false);
  }

  return (
    <div className="my-4">
      <Button onClick={handlePayCupon} disabled={loading} variant="default">
        {loading ? "Pagando cupón..." : "Pagar Cupón"}
      </Button>
      {result && <div className="mt-2 text-green-600">Transacción: {result}</div>}
      {error && <div className="mt-2 text-red-600">Error: {error}</div>}
    </div>
  );
} 