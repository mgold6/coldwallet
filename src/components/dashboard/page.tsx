import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatCard from "@/components/dashboard/StatCard";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import Watchlist from "@/components/dashboard/Watchlist";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SecurityScore from "@/components/dashboard/SecurityScore";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
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
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          <div className="xl:col-span-2">
            <PortfolioChart />
          </div>

          <Watchlist />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <RecentActivity />
          <SecurityScore />
        </div>

        <div className="mt-8">
          <QuickActions />
        </div>
      </main>
    </div>
  );
}