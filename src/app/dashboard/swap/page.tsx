import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { marketService } from "@/server/services/market.service";
import { userWalletService } from "@/server/services/user-wallet.service";

import SwapInterface from "./components/SwapInterface";

export default async function SwapPage() {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId =
    (session.user as { id: string }).id;

  const [
    markets,
    wallets,
  ] = await Promise.all([
    marketService.getMarkets(),

    userWalletService.getUserWallets(
      userId
    ),
  ]);

  const serializedWallets =
    wallets.map((wallet) => ({
      id: wallet.id,

      availableBalance:
        Number(
          wallet.availableBalance
        ),

      currency: {
        code:
          wallet.currency.code,

        name:
          wallet.currency.name,
      },
    }));

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">
          Swap Crypto
        </h1>

        <p className="mt-2 text-slate-400">
          Exchange your digital assets instantly.
        </p>
      </section>

      <SwapInterface
        markets={markets}
        wallets={serializedWallets}
      />
    </div>
  );
}