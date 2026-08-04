import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-2xl font-bold">
          ColdWallet
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Administration
        </p>
      </div>

      <nav className="space-y-2 p-4">
        <Link
          href="/dashboard/admin"
          className="block rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          Dashboard
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          Users
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          Wallets
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          Transactions
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          Support
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}