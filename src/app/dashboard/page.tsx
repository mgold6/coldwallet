import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { marketService } from "@/server/services/market.service";
import { userWalletService } from "@/server/services/user-wallet.service";
import { transactionService } from "@/server/services/transaction.service";

import LivePortfolio from "@/components/dashboard/LivePortfolio";
import TransactionHistory from "@/components/dashboard/TransactionHistory";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
    transactions,
  ] = await Promise.all([
    marketService.getMarkets(),

    userWalletService.getSelectedPortfolioWallets(
      userId
    ),

    transactionService.getUserTransactions(
      userId
    ),
  ]);

  const serializedWallets =
    wallets.map((wallet) => ({
      ...wallet,

      balance:
        Number(wallet.balance ?? 0),

      availableBalance:
        Number(
          wallet.availableBalance ?? 0
        ),

      blockchainBalance:
        Number(
          wallet.blockchainBalance ?? 0
        ),

      internalBalance:
        Number(
          wallet.internalBalance ?? 0
        ),

      lockedBalance:
        Number(
          wallet.lockedBalance ?? 0
        ),

      withdrawalLocked:
        Number(
          wallet.withdrawalLocked ?? 0
        ),

      reservedWithdrawalBalance:
        Number(
          wallet.reservedWithdrawalBalance ?? 0
        ),
    }));

  return (
    <>
      <LivePortfolio
        initialMarkets={markets}
        wallets={serializedWallets}
      />

      <div className="mt-8">
        <TransactionHistory
          transactions={transactions}
        />
      </div>
    </>
  );
}