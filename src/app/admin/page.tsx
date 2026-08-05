import StatsCards from "@/app/dashboard/admin/components/StatsCards";
import UsersTable from "@/app/dashboard/admin/components/UsersTable";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">
          Welcome to ColdWallet
        </h2>

        <p className="mt-2 text-slate-400">
          Manage users, portfolios, wallets, transactions, and platform
          settings from one place.
        </p>
      </div>

      <StatsCards />

      <UsersTable />
    </div>
  );
}