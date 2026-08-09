import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { marketService } from "@/server/services/market.service";
import { userWalletService } from "@/server/services/user-wallet.service";
import { transactionService } from "@/server/services/transaction.service";

import QuickActions from "@/components/dashboard/QuickActions";
import Tokens from "@/components/dashboard/Tokens";
import TransactionHistory from "@/components/dashboard/TransactionHistory";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId =
    (session.user as any).id;

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

  console.log(
    "DASHBOARD USER ID:",
    userId
  );

  console.log(
    "DASHBOARD WALLETS:",
    JSON.stringify(
      wallets,
      null,
      2
    )
  );

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
    }));

  const totalBalance =
    serializedWallets.reduce(
      (total, wallet) => {
        const symbol =
          wallet.currency.code.toLowerCase();

        const market =
          markets.find(
            (coin) =>
              coin.symbol.toLowerCase() ===
              symbol
          );

        const balance =
          Number(
            wallet.balance ?? 0
          );

        const usdValue =
          market
            ? balance *
              market.current_price
            : 0;

        return total + usdValue;
      },
      0
    );

  const totalChange =
    serializedWallets.reduce(
      (total, wallet) => {
        const symbol =
          wallet.currency.code.toLowerCase();

        const market =
          markets.find(
            (coin) =>
              coin.symbol.toLowerCase() ===
              symbol
          );

        const balance =
          Number(
            wallet.balance ?? 0
          );

        const usdValue =
          market
            ? balance *
              market.current_price
            : 0;

        const change =
          market
            ? usdValue *
              (
                market.price_change_percentage_24h /
                100
              )
            : 0;

        return total + change;
      },
      0
    );

  const totalChangePercentage =
    totalBalance > 0
      ? (totalChange / totalBalance) * 100
      : 0;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome back. Here's an overview of your digital assets.
        </p>
      </div>

      <div
        className="
          rounded-3xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          to-slate-950
          p-8
        "
      >
        <p className="text-slate-400">
          Total Balance
        </p>

        <h2
          className="
            mt-3
            text-5xl
            font-bold
            text-white
          "
        >
          $
          {totalBalance.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </h2>

        <p
          className={`
            mt-2
            font-medium
            ${
              totalChange >= 0
                ? "text-green-400"
                : "text-red-400"
            }
          `}
        >
          {totalChange >= 0
            ? "+"
            : "-"}

          $

          {Math.abs(
            totalChange
          ).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}

          {" "}

          (
          {totalChangePercentage >= 0
            ? "+"
            : ""}
          {totalChangePercentage.toFixed(
            2
          )}
          %
          )
        </p>
      </div>

      <div className="mt-8">
        <QuickActions />
      </div>

      <div className="mt-8">
        <Tokens
          markets={markets}
          wallets={serializedWallets}
        />
      </div>

      <div className="mt-8">
        <TransactionHistory
          transactions={transactions}
        />
      </div>
    </>
  );
}