"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  Wallet,
  Briefcase,
  ArrowLeftRight,
  FileText,
  Settings,
  Download,
  Upload,
  LifeBuoy,
} from "lucide-react";


const adminItems = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Wallets",
    href: "/admin/wallets",
    icon: Wallet,
  },
  {
    name: "Deposits",
    href: "/admin/deposits",
    icon: Download,
  },
  {
    name: "Withdrawals",
    href: "/admin/withdrawals",
    icon: Upload,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Audit Logs",
    href: "/admin/audit",
    icon: FileText,
  },
  {
    name: "Support",
    href: "/admin/support",
    icon: LifeBuoy,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];


export default function AdminSidebar() {

  return (

    <aside
      className="
        flex
        min-h-screen
        w-72
        flex-col
        border-r
        border-gray-800
        bg-slate-950
      "
    >

      <div className="p-6">

        <h1 className="text-2xl font-bold text-white">
          ColdWallet Admin
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Administration Console
        </p>

      </div>


      <nav className="flex-1 space-y-2 p-6">

        {adminItems.map((item) => {

          const Icon = item.icon;


          return (

            <Link
              key={item.name}
              href={item.href}
              className="
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-gray-300
                transition
                hover:bg-cyan-500/10
                hover:text-cyan-400
              "
            >

              <Icon size={20}/>

              <span>
                {item.name}
              </span>

            </Link>

          );

        })}

      </nav>


      <div className="border-t border-gray-800 p-6">

        <div className="rounded-xl bg-cyan-500/10 p-4">

          <h3 className="font-semibold text-white">
            Admin Access
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Manage users, wallets, assets, and platform activity.
          </p>

        </div>

      </div>


    </aside>

  );

}