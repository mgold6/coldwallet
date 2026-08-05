import { withdrawalService } from "@/server/services/withdrawal.service";

export const dynamic = "force-dynamic";

export default async function WithdrawalsPage() {
  const withdrawals = await withdrawalService.getWithdrawals();
  const stats = await withdrawalService.getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Withdrawal Management
        </h1>

        <p className="mt-2 text-slate-400">
          Review and manage cryptocurrency withdrawal requests.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Total</p>
          <h2 className="mt-2 text-3xl font-bold">
            {stats.totalWithdrawals}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-400">
            {stats.pendingWithdrawals}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Approved</p>
          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {stats.approvedWithdrawals}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Processed</p>
          <h2 className="mt-2 text-3xl font-bold text-cyan-400">
            {stats.processedWithdrawals}
          </h2>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold">
            Withdrawal Requests
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-800">
              <tr className="text-left">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Currency</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Approved</th>
                <th className="px-6 py-4">Processed</th>
              </tr>
            </thead>

            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr
                    key={withdrawal.id}
                    className="border-b border-slate-800"
                  >
                    <td className="px-6 py-4">
                      {withdrawal.wallet.portfolio.user.name ??
                        withdrawal.wallet.portfolio.user.email}
                    </td>

                    <td className="px-6 py-4">
                      {withdrawal.currency.code}
                    </td>

                    <td className="px-6 py-4">
                      {withdrawal.amount.toString()}
                    </td>

                    <td className="px-6 py-4 font-mono text-sm">
                      {withdrawal.destinationAddress}
                    </td>

                    <td className="px-6 py-4">
                      {withdrawal.approved ? "✅" : "⏳"}
                    </td>

                    <td className="px-6 py-4">
                      {withdrawal.processed ? "✅" : "⏳"}
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