import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import StatsCards from "./components/StatsCards";
import FinancialStats from "./components/FinancialStats";
import UsersTable from "./components/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Manage users, portfolios, wallets, and platform activity.
        </p>
      </section>

      <StatsCards />

      <FinancialStats />

      <UsersTable />
    </div>
  );
}