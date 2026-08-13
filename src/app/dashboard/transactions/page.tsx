import Link from "next/link";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { transactionService } from "@/server/services/transaction.service";
import { marketService } from "@/server/services/market.service";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId =
    (session.user as { id: string }).id;

  const [
    transactions,
    markets,
  ] = await Promise.all([
    transactionService.getUserTransactions(
      userId
    ),

    marketService.getMarkets(),
  ]);

  function getIcon(type: string) {
    switch (type) {
      case "DEPOSIT":
        return "↓";

      case "WITHDRAWAL":
        return "↑";

      case "INTERNAL":
        return "⇄";

      default:
        return "•";
    }
  }

  function getColor(type: string) {
    switch (type) {
      case "DEPOSIT":
        return "text-green-400";

      case "WITHDRAWAL":
        return "text-red-400";

      case "INTERNAL":
        return "text-cyan-400";

      default:
        return "text-white";
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 text-green-400";

      case "FAILED":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">
          Transactions
        </h1>

        <p className="mt-2 text-slate-400">
          Track your wallet activity and transaction history.
        </p>
      </section>

      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >
        {transactions.length === 0 ? (
          <div
            className="
              rounded-xl
              bg-slate-950
              p-8
              text-center
              text-slate-400
            "
          >
            No transactions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map(
              (transaction) => {
                const market =
                  markets.find(
                    (coin) =>
                      coin.symbol.toUpperCase() ===
                      transaction.currency.code.toUpperCase()
                  );

                const usdValue =
                  Number(
                    transaction.amount
                  ) *
                  (
                    market?.current_price ??
                    0
                  );

                return (
                  <Link
                    key={transaction.id}
                    href={`/dashboard/transactions/${transaction.id}`}
                    className="
                      block
                      rounded-2xl
                      bg-slate-950
                      p-5
                      transition
                      hover:bg-slate-800
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-800
                            text-2xl
                            ${getColor(
                              transaction.type
                            )}
                          `}
                        >
                          {getIcon(
                            transaction.type
                          )}
                        </div>

                        <div>
                          <h2 className="font-bold text-white">
                            {transaction.type}
                          </h2>

                          <p className="text-sm text-slate-400">
                            {transaction.currency.name}{" "}
                            (
                            {
                              transaction
                                .currency
                                .code
                            }
                            )
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`
                            text-lg
                            font-bold
                            ${
                              transaction.type ===
                              "DEPOSIT"
                                ? "text-green-400"
                                : transaction.type ===
                                    "WITHDRAWAL"
                                  ? "text-red-400"
                                  : "text-cyan-400"
                            }
                          `}
                        >
                          {transaction.type ===
                          "DEPOSIT"
                            ? "+"
                            : transaction.type ===
                                "WITHDRAWAL"
                              ? "-"
                              : ""}

                          {Number(
                            transaction.amount
                          ).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 8,
                            }
                          )}

                          {" "}

                          {
                            transaction
                              .currency
                              .code
                          }
                        </p>

                        <p className="text-sm text-slate-400">
                          $
                          {usdValue.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          USD
                        </p>

                        <span
                          className={`
                            mt-2
                            inline-block
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium
                            ${getStatusColor(
                              transaction.status
                            )}
                          `}
                        >
                          {
                            transaction.status
                          }
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
}