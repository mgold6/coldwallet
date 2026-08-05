import { depositService } from "@/server/services/deposit.service";

export const dynamic = "force-dynamic";

export default async function DepositsPage() {
  const deposits = await depositService.getDeposits();
  const stats = await depositService.getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Deposit Management
        </h1>

        <p className="mt-2 text-slate-400">
          View and manage all cryptocurrency deposits.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Total Deposits</p>
          <h2 className="mt-2 text-3xl font-bold">
            {stats.totalDeposits}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Confirmed</p>
          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {stats.confirmedDeposits}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-400">
            {stats.pendingDeposits}
          </h2>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold">
            Deposit History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-800">
              <tr className="text-left">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Wallet</th>
                <th className="px-6 py-4">Currency</th>
                <th className="px-6 py-4">Network</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Confirmed</th>
              </tr>
            </thead>

            <tbody>
              {deposits.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No deposits found.
                  </td>
                </tr>
              ) : (
                deposits.map((deposit) => (
                  <tr
                    key={deposit.id}
                    className="border-b border-slate-800"
                  >
                    <td className="px-6 py-4">
                      {deposit.wallet.portfolio.user.name ??
                        deposit.wallet.portfolio.user.email}
                    </td>

                    <td className="px-6 py-4 font-mono text-sm">
                      {deposit.wallet.address}
                    </td>

                    <td className="px-6 py-4">
                      {deposit.currency.code}
                    </td>

                    <td className="px-6 py-4">
                      {deposit.network?.name ?? "-"}
                    </td>

                    <td className="px-6 py-4">
                      {deposit.amount.toString()}
                    </td>

                    <td className="px-6 py-4">
                      {deposit.confirmed ? (
                        <span className="text-green-400">
                          Confirmed
                        </span>
                      ) : (
                        <span className="text-yellow-400">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}