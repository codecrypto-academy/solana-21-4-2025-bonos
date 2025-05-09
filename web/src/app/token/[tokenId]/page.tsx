import { getTokens } from "@/app/token/actions";
import clientPromise from "@/lib/mongodb";
import { getTokenBalance } from "@/lib/solana";
import TokenPayCuponClient from "./TokenPayCuponClient";

export default async function TokenDetailPage({ params }: { params: { tokenId: string } }) {
  // Obtener el token por ID
  const tokens = await getTokens();
  const token = tokens.find(t => t._id === params.tokenId);
  if (!token) return <div className="p-8">Token no encontrado</div>;

  const balance = await getTokenBalance(token.mintAddress, token.walletAddress);
  // Obtener bonistas (usuarios que han comprado este bono)
  // Suponemos que hay una colección 'bonistas' con { tokenId, userId, cantidad }
  const client = await clientPromise;
  const db = client.db();
  const bonistas = await db.collection("bonista").find({ tokenMint: token.mintAddress }).toArray() 
  
  // Suponemos que hay una colección 'users' para mostrar el nombre
  
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Detalle del Token {token.mintAddress}</h1>
      <TokenPayCuponClient mintAddress={token.mintAddress} />
      <div className="mb-4">
        <table className="w-full border">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Tipo</th>
              <th className="p-2 text-left">Symbol</th>
              <th className="p-2 text-left">Decimals</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Nominal</th>
              <th className="p-2 text-left">Porcentaje Cupón</th>
              <th className="p-2 text-left">Años</th>
              <th className="p-2 text-left">Mint Address</th>
              <th className="p-2 text-left">Wallet Address</th>
              <th className="p-2 text-left">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">{token.name}</td>
              <td className="p-2">{token.tipo}</td>
              <td className="p-2">{token.symbol}</td>
              <td className="p-2">{token.decimals}</td>
              <td className="p-2">{token.amount}</td>
              <td className="p-2">{token.nominal}</td>
              <td className="p-2">{token.porcentajeCupon}</td>
              <td className="p-2">{token.anos}</td>
              <td className="p-2">{token.mintAddress}</td>
              <td className="p-2">{token.walletAddress}</td>
              <td className="p-2">{balance}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="text-xl mb-2">Bonistas</h2>
      
      {bonistas.length === 0 ? (
        <div>No hay bonistas para este bono.</div>
      ) : (
        <table className="w-full border mb-4">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Usuario</th>
              <th className="p-2 text-left">Cantidad</th>
              <th className="p-2 text-left">Stablecoin</th>
            </tr>
          </thead>
          <tbody>
            {bonistas.map((b, index) => (
              <tr key={index} className="border-b">
                <td>{b.purchaseDate.toLocaleDateString()}</td>
                <td className="p-2">{b.address}</td>
                <td className="p-2">{b.amount}</td>
                <td className="p-2">{b.stablecoinUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 