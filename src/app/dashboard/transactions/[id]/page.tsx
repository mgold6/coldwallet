import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { transactionService } from "@/server/services/transaction.service";
import { marketService } from "@/server/services/market.service";

export const dynamic = "force-dynamic";

export default async function TransactionDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const transaction =
    await transactionService.getTransactionById(
      id
    );

  if (!transaction) {
    notFound();
  }

  const markets =
    await marketService.getMarkets();

  const market = markets.find(
    (coin) =>
      coin.symbol.toUpperCase() ===
      transaction.currency.code.toUpperCase()
  );

  const usdValue =
    Number(transaction.amount) *
    (market?.current_price ?? 0);

  const statusColor =
    transaction.status === "COMPLETED"
      ? "bg-green-500/20 text-green-400"
      : transaction.status === "FAILED"
        ? "bg-red-500/20 text-red-400"
        : "bg-yellow-500/20 text-yellow-400";

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">
          Transaction Details
        </h1>

        <p className="mt-2 text-slate-400">
          Complete information about this blockchain
          transaction.
        </p>
      </section>

      <section className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Transaction Type
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {transaction.type}
            </h2>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-medium ${statusColor}`}
          >
            {transaction.status}
          </span>
        </div>

        <div className="rounded-2xl bg-slate-950 p-6">
          <p className="text-sm text-slate-400">
            Amount
          </p>

          <h3 className="mt-2 text-4xl font-bold text-white">
            {Number(
              transaction.amount
            ).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 8,
              }
            )}{" "}
            {transaction.currency.code}
          </h3>

          <p className="mt-3 text-xl text-cyan-400">
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
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-400">
              Asset
            </p>

            <p className="mt-1 text-white">
              {transaction.currency.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Amount
            </p>

            <p className="mt-1 text-white">
              {Number(
                transaction.amount
              ).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 8,
                }
              )}{" "}
              {transaction.currency.code}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Fee
            </p>

            <p className="mt-1 text-white">
              {transaction.fee.toString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Date
            </p>

            <p className="mt-1 text-white">
              {new Date(
                transaction.createdAt
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {transaction.txHash && (
          <div>
            <p className="text-sm text-slate-400">
              Transaction Hash
            </p>

            <div className="mt-2 break-all rounded-xl bg-slate-950 p-4 font-mono text-sm text-white">
              {transaction.txHash}
            </div>
          </div>
        )}

        {transaction.fromAddress && (
          <div>
            <p className="text-sm text-slate-400">
              From Address
            </p>

            <div className="mt-2 break-all rounded-xl bg-slate-950 p-4 text-sm text-white">
              {transaction.fromAddress}
            </div>
          </div>
        )}

        {transaction.toAddress && (
          <div>
            <p className="text-sm text-slate-400">
              To Address
            </p>

            <div className="mt-2 break-all rounded-xl bg-slate-950 p-4 text-sm text-white">
              {transaction.toAddress}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}