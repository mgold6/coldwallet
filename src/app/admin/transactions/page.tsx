import { transactionService } from "@/server/services/transaction.service";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const transactions = await transactionService.getAllTransactions();
  const stats = await transactionService.getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Transactions
        </h1>

        <p className="mt-2 text-slate-400">
          View and manage all cryptocurrency transactions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Total
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.total}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-400">
            {stats.pending}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Processing
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-400">
            {stats.processing}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {stats.completed}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Failed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {stats.failed}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Cancelled
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-400">
            {stats.cancelled}
          </h2>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold">
            Transaction History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-800">
              <tr className="text-left">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Currency</th>
                <th className="px-6 py-4">Network</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-800"
                  >
                    <td className="px-6 py-4">
                      {transaction.type}
                    </td>

                    <td className="px-6 py-4">
                      {transaction.currency.code}
                    </td>

                    <td className="px-6 py-4">
                      {transaction.network?.name ?? "-"}
                    </td>

                    <td className="px-6 py-4">
                      {transaction.amount.toString()}
                    </td>

                    <td className="px-6 py-4">
                      {transaction.status}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString()}
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