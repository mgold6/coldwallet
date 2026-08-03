import StatCard from "@/components/dashboard/StatCard";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import Watchlist from "@/components/dashboard/Watchlist";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SecurityScore from "@/components/dashboard/SecurityScore";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
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
          value="$42,567.91"
          change="+4.82%"
        />

        <StatCard
          title="Today's Profit"
          value="+$1,254.32"
          change="+2.14%"
        />

        <StatCard
          title="Active Wallets"
          value="3"
          change="Secured"
        />

        <StatCard
          title="Security Score"
          value="98%"
          change="Excellent"
        />

      </section>

      {/* Portfolio */}

      <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">
          <PortfolioChart />
        </div>

        <Watchlist />

      </section>

      {/* Bottom */}

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