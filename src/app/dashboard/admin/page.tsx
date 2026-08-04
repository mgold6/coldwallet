import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCards from "./components/StatsCards";
import UsersTable from "./components/UsersTable";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
}