import { getUserAndWallets } from "../../actions";
import { getTokens } from "@/app/token/actions";
import { getBalance, getTokenBalance } from "@/lib/solana";

export default async function WalletPage({ params }: { params: { userId: string } }) {
  // Obtener usuario y wallets
  const { user, wallets } = await getUserAndWallets(params.userId);
  if (!user) return <div className="p-8">Usuario no encontrado</div>;
  if (!wallets || wallets.length === 0) return <div className="p-8">No hay wallets para este usuario</div>;

  // Por simplicidad, mostramos la primera wallet (puedes adaptar para seleccionar una específica)
  const wallet = wallets[0];
  const solBalance = await getBalance(wallet.address);

  // Obtener todos los tokens y filtrar los que pertenecen a esta wallet
  const tokens = (await getTokens()).filter(t => t.walletAddress === wallet.address);

  // Obtener balances de cada token
  const tokenBalances = await Promise.all(
    tokens.map(async (token) => {
      let balance = null;
      try {
        balance = await getTokenBalance(token.mintAddress, wallet.address);
      } catch {
        balance = "-";
      }
      return { ...token, balance };
    })
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Wallet de {user.name}</h1>
      <div className="mb-4">
        <strong>Dirección:</strong> {wallet.address}<br />
        <strong>SOL Balance:</strong> {solBalance}
      </div>
      <h2 className="text-xl mb-2">Tokens</h2>
      {tokenBalances.length === 0 ? (
        <div>No hay tokens asociados a esta wallet.</div>
      ) : (
        <table className="w-full border mb-4">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Symbol</th>
              <th className="p-2 text-left">Tipo</th>
              <th className="p-2 text-left">Mint Address</th>
              <th className="p-2 text-left">Balance</th>
            </tr>
          </thead>
          <tbody>
            {tokenBalances.map((token) => (
              <tr key={token._id} className="border-b">
                <td className="p-2">{token.name}</td>
                <td className="p-2">{token.symbol}</td>
                <td className="p-2">{token.tipo}</td>
                <td className="p-2">{token.mintAddress}</td>
                <td className="p-2">{token.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 