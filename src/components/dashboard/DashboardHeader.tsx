"use client";

import { Menu } from "lucide-react";

type DashboardHeaderProps = {
  onMenuClick?: () => void;
  isAdmin?: boolean;
};

export default function DashboardHeader({
  onMenuClick,
  isAdmin = false,
}: DashboardHeaderProps) {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-300 transition hover:bg-slate-700 hover:text-white md:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold sm:text-2xl">
            {isAdmin ? "Admin Dashboard" : "Dashboard"}
          </h1>

          <p className="hidden text-sm text-slate-400 sm:block">
            {isAdmin
              ? "ColdWallet Administration"
              : "Digital Asset Dashboard"}
          </p>
        </div>
      </div>

      <div className="shrink-0 rounded-full bg-slate-800 px-3 py-2 text-xs text-slate-300 sm:px-4 sm:text-sm">
        Administrator
      </div>
    </header>
  );
}
