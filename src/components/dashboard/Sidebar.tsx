"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  BookOpen,
  ShieldCheck,
  Settings,
  Bell,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Portfolio",
    href: "/dashboard/portfolio",
    icon: Wallet,
  },
  {
    name: "Markets",
    href: "/dashboard/markets",
    icon: LineChart,
  },
  {
    name: "Learning",
    href: "/dashboard/learning",
    icon: BookOpen,
  },
  {
    name: "Security",
    href: "/dashboard/security",
    icon: ShieldCheck,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#111827] border-r border-gray-800 min-h-screen flex flex-col">
      <div className="p-8 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-cyan-400">
          ColdWallet
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          Secure Digital Asset Platform
        </p>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="rounded-xl bg-cyan-500/10 p-4">
          <h3 className="font-semibold">
            Security Status
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            Your account is fully protected.
          </p>

          <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="w-[98%] h-full bg-cyan-400 rounded-full"></div>
          </div>

          <p className="text-cyan-400 text-sm mt-2">
            98% Secure
          </p>
        </div>
      </div>
    </aside>
  );
}