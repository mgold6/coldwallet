"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavigation = [
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

const userNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Receive",
    href: "/dashboard/receive",
  },
  {
    name: "Send",
    href: "/dashboard/send",
  },
  {
    name: "Swap",
    href: "/dashboard/swap",
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <aside
      className="
        hidden
        min-h-screen
        w-72
        shrink-0
        flex-col
        border-r
        border-slate-800
        bg-slate-900
        md:flex
      "
    >
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          ColdWallet
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {isAdmin
            ? "Administration Portal"
            : "Digital Asset Dashboard"}
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" &&
              item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block
                rounded-lg
                px-4
                py-3
                transition
                ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-cyan-400"
                }
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-6">
        <div className="rounded-xl bg-cyan-500/10 p-4">
          <h3 className="font-semibold text-white">
            {isAdmin ? "Admin Access" : "Secure Account"}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {isAdmin
              ? "Manage users, wallets, assets, and platform activity."
              : "Manage your digital assets and account securely."}
          </p>
        </div>
      </div>
    </aside>
  );
}
