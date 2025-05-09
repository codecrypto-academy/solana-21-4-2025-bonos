import { getTokens } from "@/app/token/actions";
import TokenClient from "@/app/token/TokenClient";

export default async function TokenPage() {
  try {
    const tokens = await getTokens();
    return <TokenClient tokens={tokens} />;
  } catch (e) {
    return <div className="p-8 text-red-500">Error cargando tokens</div>;
  }
} 