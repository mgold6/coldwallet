interface WalletDepositsProps {
  wallet: any;
}

export default function WalletDeposits({
  wallet,
}: WalletDepositsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Recent Deposits
      </h2>

      {wallet.deposits?.length ? (
        <div className="space-y-4">
          {wallet.deposits.map((deposit: any) => (
            <div
              key={deposit.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 p-4"
            >
              <div>
                <p className="font-semibold">
                  {deposit.amount.toString()} {wallet.currency.code}
                </p>

                <p className="text-sm text-slate-400">
                  {new Date(deposit.createdAt).toLocaleString()}
                </p>
              </div>

              <span>
                {deposit.confirmed ? "✅ Confirmed" : "⏳ Pending"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400">
          No deposits found.
        </p>
      )}
    </div>
  );
}