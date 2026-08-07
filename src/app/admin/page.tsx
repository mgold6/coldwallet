import { dashboardService } from "@/server/services/dashboard.service";


export const dynamic = "force-dynamic";



export default async function AdminDashboardPage() {


  const [

    stats,

    transactions,

    withdrawals,

    security,

    auditLogs,

  ] = await Promise.all([


    dashboardService.getStats(),

    dashboardService.getTransactionStats(),

    dashboardService.getWithdrawalStats(),

    dashboardService.getSecurityStats(),

    dashboardService.getRecentAuditLogs(),


  ]);







  return (

    <div className="space-y-8">





      {/* Header */}

      <section>

        <h1 className="text-3xl font-bold text-white">
          ColdWallet Admin Dashboard
        </h1>


        <p className="mt-2 text-slate-400">
          Monitor users, wallets, transactions, security and platform activity.
        </p>

      </section>









      {/* Platform Overview */}

      <section>

        <h2 className="mb-4 text-xl font-semibold text-white">
          Platform Overview
        </h2>



        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">


          {[
            {
              title: "Total Users",
              value: stats.totalUsers,
            },

            {
              title: "Active Users",
              value: stats.activeUsers,
            },

            {
              title: "Wallets",
              value: stats.totalWallets,
            },

            {
              title: "Portfolios",
              value: stats.totalPortfolios,
            },

          ].map((card) => (

            <div
              key={card.title}
              className="
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-6
              "
            >

              <p className="text-sm text-slate-400">
                {card.title}
              </p>


              <p className="mt-3 text-3xl font-bold text-white">
                {card.value}
              </p>


            </div>

          ))}


        </div>

      </section>









      {/* Transactions */}

      <section>


        <h2 className="mb-4 text-xl font-semibold text-white">
          Transaction Monitoring
        </h2>


        <div className="grid gap-6 md:grid-cols-4">


          {[
            {
              title: "Total",
              value: transactions.total,
            },

            {
              title: "Pending",
              value: transactions.pending,
            },

            {
              title: "Completed",
              value: transactions.completed,
            },

            {
              title: "Failed",
              value: transactions.failed,
            },

          ].map((item) => (

            <div
              key={item.title}
              className="
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                p-5
              "
            >

              <p className="text-sm text-slate-400">
                {item.title}
              </p>


              <p className="mt-2 text-2xl font-bold text-white">
                {item.value}
              </p>


            </div>

          ))}


        </div>


      </section>









      {/* Withdrawals */}

      <section>


        <h2 className="mb-4 text-xl font-semibold text-white">
          Withdrawal Monitoring
        </h2>


        <div className="grid gap-6 md:grid-cols-3">


          {[
            {
              title: "Pending Withdrawals",
              value: withdrawals.pending,
            },

            {
              title: "Processed Withdrawals",
              value: withdrawals.processed,
            },

            {
              title: "Total Withdrawals",
              value: withdrawals.total,
            },

          ].map((item) => (

            <div
              key={item.title}
              className="
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-6
              "
            >

              <p className="text-sm text-slate-400">
                {item.title}
              </p>


              <p className="mt-3 text-3xl font-bold text-white">
                {item.value}
              </p>


            </div>

          ))}


        </div>


      </section>









      {/* Security */}

      <section>


        <h2 className="mb-4 text-xl font-semibold text-white">
          Security Monitoring
        </h2>



        <div className="grid gap-6 md:grid-cols-2">


          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
            "
          >

            <p className="text-sm text-slate-400">
              Successful Logins
            </p>


            <p className="mt-3 text-3xl font-bold text-green-400">
              {security.successfulLogins}
            </p>


          </div>





          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
            "
          >

            <p className="text-sm text-slate-400">
              Failed Login Attempts
            </p>


            <p className="mt-3 text-3xl font-bold text-red-400">
              {security.failedLogins}
            </p>


          </div>


        </div>


      </section>









      {/* Recent Activity */}

      <section>


        <h2 className="mb-4 text-xl font-semibold text-white">
          Recent Admin Activity
        </h2>



        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            overflow-hidden
          "
        >


          {auditLogs.length === 0 ? (

            <div className="p-8 text-center text-slate-400">

              No activity recorded.

            </div>


          ) : (


            auditLogs.map((log) => (

              <div
                key={log.id}
                className="
                  border-b
                  border-slate-800
                  p-5
                "
              >

                <p className="font-semibold text-white">
                  {log.action}
                </p>


                <p className="mt-1 text-sm text-slate-400">

                  {log.user?.email ?? "System"} • {log.entity}

                </p>


                <p className="mt-2 text-sm text-slate-500">

                  {log.metadata}

                </p>


              </div>

            ))

          )}


        </div>


      </section>






    </div>

  );

}