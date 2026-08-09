import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { userWalletService } from "@/server/services/user-wallet.service";

import ReceiveWallet from "./components/ReceiveWallet";

export default async function ReceivePage() {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId =
    (session.user as any).id;


  const wallets =
    await userWalletService.getUserWallets(
      userId
    );


  const validWallets =
  wallets
    .filter(
      (wallet) =>
        wallet.address !== null
    )
    .map((wallet) => ({
      ...wallet,
      address: wallet.address!,
    }));


  return (
    <div className="mx-auto max-w-xl space-y-8">

      <section>

        <h1 className="text-3xl font-bold text-white">
          Receive Crypto
        </h1>


        <p className="mt-2 text-slate-400">
          Receive digital assets into your ColdWallet account.
        </p>

      </section>


      <ReceiveWallet
        wallets={validWallets}
      />

    </div>
  );
}