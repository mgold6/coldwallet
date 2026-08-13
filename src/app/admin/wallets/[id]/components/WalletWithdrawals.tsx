interface WalletWithdrawalsProps {
  wallet: {
    currency: {
      code: string;
    };
    withdrawals: Array<{
      id: string;
      amount: {
        toString(): string;
      };
      createdAt: Date;
      approved: boolean;
      processed: boolean;
    }>;
  };
}

export default function WalletWithdrawals({
  wallet,
}: WalletWithdrawalsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Recent Withdrawals
      </h2>

      {wallet.withdrawals?.length ? (
        <div className="space-y-4">
          {wallet.withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 p-4"
            >
              <div>
                <p className="font-semibold">
                  {withdrawal.amount.toString()}{" "}
                  {wallet.currency.code}
                </p>

                <p className="text-sm text-slate-400">
                  {new Date(
                    withdrawal.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p>
                  {withdrawal.approved
                    ? "✅ Approved"
                    : "⏳ Pending"}
                </p>

                <p className="text-sm text-slate-400">
                  {withdrawal.processed
                    ? "Processed"
                    : "Waiting"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400">
          No withdrawals found.
        </p>
      )}
    </div>
  );
}