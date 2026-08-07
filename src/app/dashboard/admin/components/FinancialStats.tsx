import { dashboardService } from "@/server/services/dashboard.service";


export default async function FinancialStats() {

  const stats =
    await dashboardService.getFinancialStats();


  const cards = [

    {
      title: "Total Deposits",
      value: stats.totalDeposits,
    },

    {
      title: "Confirmed Deposits",
      value: stats.confirmedDeposits,
    },

    {
      title: "Total Withdrawals",
      value: stats.totalWithdrawals,
    },

    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawalAmount,
    },

    {
      title: "Transaction Volume",
      value: stats.transactionVolume,
    },

  ];


  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

      {cards.map((card) => (

        <div
          key={card.title}
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            p-6
          "
        >

          <p className="text-sm text-slate-400">
            {card.title}
          </p>


          <h2 className="mt-3 text-2xl font-bold text-cyan-400">
            $
            {Number(card.value).toLocaleString()}
          </h2>


        </div>

      ))}

    </div>

  );

}