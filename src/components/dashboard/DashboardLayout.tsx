"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import MobileDashboardSidebar from "./MobileDashboardSidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

const adminNavigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
  { name: "Wallets", href: "/admin/wallets" },
  { name: "Deposits", href: "/admin/deposits" },
  { name: "Withdrawals", href: "/admin/withdrawals" },
  { name: "Transactions", href: "/admin/transactions" },
  { name: "Audit Logs", href: "/admin/audit" },
  { name: "Support", href: "/admin/support" },
  { name: "Settings", href: "/admin/settings" },
];

const userNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Receive", href: "/dashboard/receive" },
  { name: "Send", href: "/dashboard/send" },
  { name: "Swap", href: "/dashboard/swap" },
  { name: "Transactions", href: "/dashboard/transactions" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  const navigation = isAdmin
    ? adminNavigation
    : userNavigation;

  return (
    <div className="flex min-h-screen min-w-0 bg-slate-950 text-white">
      <DashboardSidebar />

      <MobileDashboardSidebar
        navigation={navigation}
        isAdmin={isAdmin}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          isAdmin={isAdmin}
        />

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}