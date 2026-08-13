interface WalletTransactionsProps {
  wallet: {
    currency: {
      code: string;
    };
    transactions: Array<{
      id: string;
      type: string;
      createdAt: Date;
      amount: {
        toString(): string;
      };
      status: string;
    }>;
  };
}

export default function WalletTransactions({
  wallet,
}: WalletTransactionsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Recent Transactions
      </h2>

      {wallet.transactions?.length ? (
        <div className="space-y-4">
          {wallet.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 p-4"
            >
              <div>
                <p className="font-semibold">
                  {transaction.type}
                </p>

                <p className="text-sm text-slate-400">
                  {new Date(
                    transaction.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p>
                  {transaction.amount.toString()}{" "}
                  {wallet.currency.code}
                </p>

                <p className="text-sm text-slate-400">
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400">
          No transactions found.
        </p>
      )}
    </div>
  );
}