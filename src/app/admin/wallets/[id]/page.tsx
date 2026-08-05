import { notFound } from "next/navigation";

import { adminWalletService } from "@/server/services/admin-wallet.service";

import WalletSummary from "./components/WalletSummary";
import WalletOwner from "./components/WalletOwner";
import WalletBusinessInfo from "./components/WalletBusinessInfo";
import WalletDeposits from "./components/WalletDeposits";
import WalletWithdrawals from "./components/WalletWithdrawals";
import WalletTransactions from "./components/WalletTransactions";

interface WalletPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function WalletDetailsPage({
  params,
}: WalletPageProps) {
  const { id } = await params;

  const wallet =
    await adminWalletService.getWalletById(id);

  if (!wallet) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Wallet Details
        </h1>

        <p className="mt-2 text-slate-400">
          Complete wallet overview and activity.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WalletSummary wallet={wallet} />
        <WalletOwner wallet={wallet} />
      </div>

      <WalletBusinessInfo wallet={wallet} />

      <WalletDeposits wallet={wallet} />

      <WalletWithdrawals wallet={wallet} />

      <WalletTransactions wallet={wallet} />
    </div>
  );
}