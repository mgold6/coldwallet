export default function AuditPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Audit Logs
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor every administrative action performed within ColdWallet.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-semibold">
            Activity History
          </h2>
        </div>

        <div className="py-20 text-center text-slate-400">
          No audit records have been recorded yet.
        </div>
      </div>
    </div>
  );
}