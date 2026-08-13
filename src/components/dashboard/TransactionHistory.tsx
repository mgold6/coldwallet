import { Prisma } from "@prisma/client";

interface TransactionCurrency {
  code: string;
  name: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: Prisma.Decimal;
  usdAmount?: Prisma.Decimal | string | number | null;
  createdAt: Date;
  status: string;
  currency: TransactionCurrency;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-6
      "
    >
      <h2 className="mb-6 text-2xl font-bold text-white">
        Recent Activity
      </h2>

      {transactions.length === 0 ? (
        <div
          className="
            rounded-xl
            bg-slate-950
            p-6
            text-center
            text-slate-400
          "
        >
          No transactions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const isWithdrawal =
              transaction.type === "WITHDRAWAL";

            const cryptoAmount = Number(
              transaction.amount
            );

            const usdAmount = Number(
              transaction.usdAmount ?? 0
            );

            return (
              <div
                key={transaction.id}
                className="
                  rounded-xl
                  bg-slate-950
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        font-semibold
                        text-white
                      "
                    >
                      {isWithdrawal
                        ? "↗ Sent"
                        : "↓ Received"}{" "}
                      {transaction.currency.name}
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-400
                      "
                    >
                      {transaction.createdAt.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`
                        text-lg
                        font-bold
                        ${
                          isWithdrawal
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      `}
                    >
                      {isWithdrawal ? "-" : "+"}$
                      {usdAmount.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>

                    <p
                      className="
                        text-sm
                        text-white
                      "
                    >
                      {cryptoAmount.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        }
                      )}{" "}
                      {transaction.currency.code}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-4
                    border-t
                    border-slate-800
                    pt-4
                    text-sm
                  "
                >
                  <p
                    className={
                      transaction.status ===
                      "COMPLETED"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {transaction.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}