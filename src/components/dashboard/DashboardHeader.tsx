export default function DashboardHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-900 px-8">
      <div>
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-sm text-slate-400">
          ColdWallet Administration
        </p>
      </div>

      <div className="rounded-full bg-slate-800 px-4 py-2">
        Administrator
      </div>
    </header>
  );
}