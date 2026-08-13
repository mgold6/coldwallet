"use client";

import Link from "next/link";
import { useState } from "react";

import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Coins,
  BookOpen,
  ShieldCheck,
  Settings,
  Bell,
  Menu,
  X,
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
    name: "Earn",
    href: "/dashboard/earn",
    icon: Coins,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="
          hidden
          min-h-screen
          w-72
          shrink-0
          flex-col
          border-r
          border-gray-800
          bg-slate-950
          md:flex
        "
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">
            ColdWallet
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Secure Digital Asset Platform
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-6">
          {menuItems.map((item) => {
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
                  transition-all
                  hover:bg-cyan-500/10
                  hover:text-cyan-400
                "
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-800 p-6">
          <div className="rounded-xl bg-cyan-500/10 p-4">
            <h3 className="font-semibold text-white">
              Security Status
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Two-factor authentication, login monitoring, and wallet
              protection enabled.
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-700">
              <div className="h-full w-full rounded-full bg-cyan-400" />
            </div>

            <p className="mt-2 text-sm text-cyan-400">
              100% Secure
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="
          fixed
          left-4
          top-4
          z-50
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-gray-700
          bg-slate-900
          text-white
          shadow-lg
          md:hidden
        "
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-[60]
            bg-black/70
            md:hidden
          "
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-[70]
          flex
          w-[min(82vw,320px)]
          flex-col
          border-r
          border-gray-800
          bg-slate-950
          shadow-2xl
          transition-transform
          duration-200
          md:hidden
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h1 className="text-xl font-bold text-white">
              ColdWallet
            </h1>

            <p className="mt-1 text-xs text-gray-400">
              Secure Digital Asset Platform
            </p>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-slate-900
              text-gray-300
              hover:text-white
            "
          >
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="
                    flex
                    min-h-12
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
                  <Icon size={21} />

                  <span className="text-base">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-800 p-4">
          <div className="rounded-xl bg-cyan-500/10 p-4">
            <h3 className="font-semibold text-white">
              Security Status
            </h3>

            <p className="mt-2 text-xs leading-5 text-gray-400">
              Two-factor authentication, login monitoring, and wallet
              protection enabled.
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-700">
              <div className="h-full w-full rounded-full bg-cyan-400" />
            </div>

            <p className="mt-2 text-xs text-cyan-400">
              100% Secure
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
