import { getBalance, getTokenBalance } from "@/lib/solana";
import { getTokens } from "@/app/token/actions";
import { ObjectId } from "mongodb";
import  WalletDetailClient  from "@/app/users/[userId]/wallets/[walletId]/WalletDetailClient";

export interface WalletDetailToken {
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

export interface WalletDetailWallet {
  _id: string;
  address: string;
}

export default async function WalletDetailPage({
  params,
}: {
  params: { userId: string; walletId: string };
}) {
  // Aquí walletId es el _id del wallet en la base de datos
  // Necesitamos buscar la dirección del wallet a partir del walletId
  const client = await import("@/lib/mongodb").then((m) => m.default);
  const db = (await client)!.db();
  const wallet = await db
    .collection("wallets")
    .findOne({ _id: new ObjectId(params.walletId) });
  if (!wallet) return <div className="p-8">Wallet no encontrado</div>;
  const balance = await getBalance(wallet.address);
  const tokens = await getTokens();

  // Obtener el balance de cada token para la wallet
  const balances = await Promise.all(
    tokens.map(async (token) => {
      try {
        const bal = await getTokenBalance(token.mintAddress, wallet.address);
        return Number(bal);
      } catch {
        return 0;
      }
    })
  );
  const wallet2 = {
    ...wallet,
    _id: wallet._id.toString(),
  };
  console.log(wallet2);
  return (
    <WalletDetailClient
      wallet={wallet2 as unknown as WalletDetailWallet}
      tokens={tokens as WalletDetailToken[]}
      balances={balances}
      solBalance={balance}
    />
  );
}
