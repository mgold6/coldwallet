import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";

import { dashboardService } from "@/server/services/dashboard.service";

import UserEditForm from "./components/UserEditForm";
import PortfolioManager from "./components/PortfolioManager";


interface UserDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}


export const dynamic = "force-dynamic";



export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {


  const { id } =
    await params;



  const user =
    await dashboardService.getUserDetails(id);



  if (!user) {

    notFound();

  }



  const loginHistory =
    await prisma.loginHistory.findMany({

      where: {

        userId: id,

      },


      orderBy: {

        createdAt: "desc",

      },


      take: 10,

    });



  const walletCount =
    user.portfolios.reduce(
      (count, portfolio) =>
        count + portfolio.wallets.length,
      0
    );



  const totalBalance =
    user.portfolios.reduce(
      (total, portfolio) =>
        total +
        portfolio.wallets.reduce(
          (walletTotal, wallet) =>
            walletTotal + Number(wallet.balance),
          0
        ),
      0
    );



  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-bold text-white">
          User Details
        </h1>


        <p className="mt-2 text-slate-400">
          Complete profile, portfolios, wallets and security overview.
        </p>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">


        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">


          <h2 className="mb-4 text-xl font-semibold text-white">
            Profile
          </h2>



          <div className="space-y-4">


            <div>

              <p className="text-sm text-slate-400">
                Name
              </p>

              <p className="text-white">
                {user.name ?? "Unnamed User"}
              </p>

            </div>



            <div>

              <p className="text-sm text-slate-400">
                Email
              </p>

              <p className="text-white">
                {user.email}
              </p>

            </div>



            <div>

              <p className="text-sm text-slate-400">
                Role
              </p>

              <p className="text-white">
                {user.role}
              </p>

            </div>



            <div>

              <p className="text-sm text-slate-400">
                Status
              </p>

              <p className="text-white">
                {user.status}
              </p>

            </div>



            <div>

              <p className="text-sm text-slate-400">
                Registered
              </p>

              <p className="text-white">
                {user.createdAt.toLocaleDateString()}
              </p>

            </div>


          </div>


        </div>






        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">


          <h2 className="mb-4 text-xl font-semibold text-white">
            Portfolio Summary
          </h2>



          <div className="grid grid-cols-2 gap-6">


            <div>

              <p className="text-sm text-slate-400">
                Portfolios
              </p>

              <p className="text-3xl font-bold text-white">
                {user.portfolios.length}
              </p>

            </div>




            <div>

              <p className="text-sm text-slate-400">
                Wallets
              </p>

              <p className="text-3xl font-bold text-white">
                {walletCount}
              </p>

            </div>





            <div className="col-span-2">

              <p className="text-sm text-slate-400">
                Total Balance
              </p>


              <p className="text-4xl font-bold text-cyan-400">

                $
                {totalBalance.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}

              </p>

            </div>


          </div>


        </div>


      </div>





      {/* Portfolio Management */}

      <PortfolioManager
        userId={user.id}
      />





      {/* User Management */}

      <UserEditForm
        user={{
          id: user.id,
          role: user.role,
          status: user.status,
          firstName: user.firstName,
          lastName: user.lastName,
        }}
      />
            <div className="rounded-xl border border-slate-800 bg-slate-900">


        <div className="border-b border-slate-800 p-6">

          <h2 className="text-xl font-semibold text-white">
            Login History
          </h2>

        </div>



        <div className="overflow-x-auto">

          <table className="min-w-full">


            <thead className="border-b border-slate-800">

              <tr className="text-left text-slate-400">


                <th className="px-6 py-4">
                  Date
                </th>


                <th className="px-6 py-4">
                  IP Address
                </th>


                <th className="px-6 py-4">
                  Device
                </th>


                <th className="px-6 py-4">
                  Status
                </th>


              </tr>

            </thead>



            <tbody>


              {loginHistory.map((login) => (

                <tr
                  key={login.id}
                  className="border-b border-slate-800"
                >


                  <td className="px-6 py-4 text-white">
                    {login.createdAt.toLocaleString()}
                  </td>



                  <td className="px-6 py-4 text-slate-300">
                    {login.ipAddress}
                  </td>



                  <td className="px-6 py-4 text-slate-300">
                    {login.userAgent}
                  </td>



                  <td className="px-6 py-4">

                    <span
                      className={
                        login.success
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {login.success
                        ? "Success"
                        : "Failed"}
                    </span>

                  </td>


                </tr>

              ))}


            </tbody>


          </table>

        </div>


      </div>








      <div className="rounded-xl border border-slate-800 bg-slate-900">


        <div className="border-b border-slate-800 p-6">


          <h2 className="text-xl font-semibold text-white">
            Wallets
          </h2>


        </div>




        <div className="overflow-x-auto">


          <table className="min-w-full">


            <thead className="border-b border-slate-800">


              <tr className="text-left">


                <th className="px-6 py-4">
                  Currency
                </th>


                <th className="px-6 py-4">
                  Network
                </th>


                <th className="px-6 py-4">
                  Address
                </th>


                <th className="px-6 py-4">
                  Balance
                </th>


                <th className="px-6 py-4">
                  Status
                </th>


              </tr>


            </thead>




            <tbody>


              {user.portfolios.flatMap((portfolio) =>

                portfolio.wallets.map((wallet) => (


                  <tr
                    key={wallet.id}
                    className="border-b border-slate-800"
                  >


                    <td className="px-6 py-4 text-white">
                      {wallet.currency.code}
                    </td>



                    <td className="px-6 py-4 text-white">
                      {wallet.network?.name ?? "-"}
                    </td>



                    <td className="px-6 py-4 font-mono text-sm text-white">

                      {wallet.address.slice(0, 12)}...
                      {wallet.address.slice(-8)}

                    </td>



                    <td className="px-6 py-4 text-white">

                      {Number(wallet.balance).toLocaleString()}

                    </td>



                    <td className="px-6 py-4 text-white">

                      {wallet.status}

                    </td>


                  </tr>


                ))

              )}


            </tbody>


          </table>


        </div>


      </div>



    </div>

  );

}