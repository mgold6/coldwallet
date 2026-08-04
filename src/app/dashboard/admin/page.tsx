export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <p className="mt-2 text-slate-400">
          Welcome to the ColdWallet administration panel.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-sm text-slate-400">Users</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-sm text-slate-400">Wallets</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-sm text-slate-400">Transactions</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-sm text-slate-400">Pending Withdrawals</h2>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}