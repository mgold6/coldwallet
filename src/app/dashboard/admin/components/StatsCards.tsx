import { dashboardService } from "@/server/services/dashboard.service";

export default async function StatsCards() {
  const stats = await dashboardService.getStats();

  const cards = [
    {
      title: "Users",
      value: stats.totalUsers,
    },
    {
      title: "Wallets",
      value: stats.totalWallets,
    },
    {
      title: "Portfolios",
      value: stats.totalPortfolios,
    },
    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">
            {card.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}