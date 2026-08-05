import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { dashboardService } from "@/server/services/dashboard.service";
import { analyticsService } from "@/server/services/analytics.service";

import StatCard from "@/components/dashboard/StatCard";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import PortfolioAllocation from "@/components/dashboard/PortfolioAllocation";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SecurityScore from "@/components/dashboard/SecurityScore";
import QuickActions from "@/components/dashboard/QuickActions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [stats, history, allocation] = await Promise.all([
    dashboardService.getDashboardStats(userId),
    analyticsService.getPortfolioHistory(userId),
    analyticsService.getAssetAllocation(userId),
  ]);

  return (
    <>
      {/* Welcome */}

      <section>
        <h1 className="text-4xl font-bold text-white">
          Welcome to ColdWallet
        </h1>

        <p className="mt-3 max-w-3xl text-lg text-gray-400">
          Manage your digital assets securely, monitor live cryptocurrency
          markets, organize your portfolio, and continue learning through one
          professional platform.
        </p>
      </section>

      {/* Statistics */}

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Portfolio Value"
          value={`$${stats.portfolioValue}`}
          change={`${stats.depositCount} Deposits`}
        />

        <StatCard
          title="Today's Profit"
          value={`$${stats.todaysProfit}`}
          change={`${stats.withdrawalCount} Withdrawals`}
        />

        <StatCard
          title="Active Wallets"
          value={stats.activeWallets.toString()}
          change="Active"
        />

        <StatCard
          title="Security Score"
          value={`${stats.securityScore}%`}
          change="Excellent"
        />
      </section>

      {/* Portfolio Analytics */}

      <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PortfolioChart data={history} />
        </div>

        <PortfolioAllocation data={allocation} />
      </section>

      {/* Bottom Section */}

      <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentActivity />

        <SecurityScore />
      </section>

      {/* Quick Actions */}

      <section className="mt-10">
        <QuickActions />
      </section>
    </>
  );
}