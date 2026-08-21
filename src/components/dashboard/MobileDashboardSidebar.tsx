"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

type NavigationItem = {
  name: string;
  href: string;
};

type MobileDashboardSidebarProps = {
  navigation: NavigationItem[];
  isAdmin: boolean;
  open: boolean;
  onClose: () => void;
};

export default function MobileDashboardSidebar({
  navigation,
  isAdmin,
  open,
  onClose,
}: MobileDashboardSidebarProps) {
  const pathname = usePathname();

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
      />

      {/* Mobile drawer */}
      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[min(84vw,20rem)]
          flex-col
          border-r
          border-slate-800
          bg-slate-950
          shadow-2xl
          md:hidden
        "
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">
              ColdWallet
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              {isAdmin
                ? "Administration Portal"
                : "Digital Asset Dashboard"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
            "
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
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
                  onClick={onClose}
                  className={`
                    block
                    rounded-xl
                    px-4
                    py-3.5
                    text-sm
                    font-medium
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
          </div>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="rounded-xl bg-cyan-500/10 p-4">
            <p className="text-sm font-semibold text-white">
              {isAdmin ? "Admin Access" : "Secure Account"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {isAdmin
                ? "Manage users, wallets, assets, and platform activity."
                : "Manage your digital assets and account securely."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
