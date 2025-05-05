import { getUserAndWallets, addWallet } from "./actions";
import UserWalletsClient from "./UserWalletsClient";

export default async function UserDetailPage({ params }: { params: { userId: string } }) {
  const { user, wallets } = await getUserAndWallets(params.userId);
  if (!user) return <div className="p-8">Usuario no encontrado</div>;
  async function addWalletAction() {
    "use server";
    await addWallet(params.userId);
  }
  return <UserWalletsClient user={user} wallets={wallets} addWallet={addWalletAction} />;
} 