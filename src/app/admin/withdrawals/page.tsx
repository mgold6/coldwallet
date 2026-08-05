import { withdrawalService } from "@/server/services/withdrawal.service";
import WithdrawalTable from "./components/WithdrawalTable";

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
          <p className="text-sm text-slate-400">
            Total
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.totalWithdrawals}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-400">
            {stats.pendingWithdrawals}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Approved
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {stats.approvedWithdrawals}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Processed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-cyan-400">
            {stats.processedWithdrawals}
          </h2>
        </div>
      </div>

      <div>
        <WithdrawalTable withdrawals={withdrawals} />
      </div>
    </div>
  );
}