import Link from "next/link";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
  },
  {
    name: "Users",
    href: "/admin/users",
  },
  {
    name: "Wallets",
    href: "/admin/wallets",
  },
  {
    name: "Deposits",
    href: "/admin/deposits",
  },
  {
    name: "Withdrawals",
    href: "/admin/withdrawals",
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
  },
  {
    name: "Audit Logs",
    href: "/admin/audit",
  },
  {
    name: "Support",
    href: "/admin/support",
  },
  {
    name: "Settings",
    href: "/admin/settings",
  },
];

export default function DashboardSidebar() {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          ColdWallet
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Administration Portal
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-3 transition hover:bg-slate-800 hover:text-cyan-400"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}