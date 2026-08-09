import Link from "next/link";
import { adminWalletService } from "@/server/services/admin-wallet.service";

export default async function WalletsPage() {
  const wallets = await adminWalletService.getWallets();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Wallet Management
        </h1>

        <p className="mt-2 text-slate-400">
          View, search, edit, and manage all assigned cryptocurrency wallets.
        </p>
      </div>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Total Wallets
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {wallets.length}
          </h2>
        </div>


        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Active Wallets
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              wallets.filter(
                wallet => wallet.status === "ACTIVE"
              ).length
            }
          </h2>
        </div>


        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Disabled Wallets
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              wallets.filter(
                wallet => wallet.status === "DISABLED"
              ).length
            }
          </h2>
        </div>


        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Currencies
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              new Set(
                wallets.map(
                  wallet => wallet.currency.code
                )
              ).size
            }
          </h2>
        </div>

      </div>





      <div className="rounded-xl border border-slate-800 bg-slate-900">

        <div className="border-b border-slate-800 p-6">

          <h2 className="text-xl font-semibold">
            Assigned Wallets
          </h2>

        </div>



        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="border-b border-slate-800">

              <tr className="text-left">

                <th className="px-6 py-4">
                  Wallet
                </th>

                <th className="px-6 py-4">
                  Currency
                </th>

                <th className="px-6 py-4">
                  Network
                </th>

                <th className="px-6 py-4">
                  Portfolio
                </th>

                <th className="px-6 py-4">
                  User
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

              {wallets.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No wallets have been assigned yet.
                  </td>

                </tr>


              ) : (

                wallets.map((wallet) => (

                  <tr
                    key={wallet.id}
                    className="border-b border-slate-800"
                  >


                    <td className="px-6 py-4 font-mono text-sm">

                      <Link
                        href={`/admin/wallets/${wallet.id}`}
                        className="
                          text-cyan-400
                          hover:text-cyan-300
                        "
                      >

                        {wallet.address
  ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-8)}`
  : "Address not generated"}

                      </Link>

                    </td>



                    <td className="px-6 py-4">
                      {wallet.currency.code}
                    </td>



                    <td className="px-6 py-4">
                      {wallet.network?.name ?? "-"}
                    </td>



                    <td className="px-6 py-4">
                      {wallet.portfolio.name}
                    </td>



                    <td className="px-6 py-4">
                      {
                        wallet.portfolio.user.name ??
                        wallet.portfolio.user.email
                      }
                    </td>



                    <td className="px-6 py-4">
                      {wallet.balance.toString()}
                    </td>



                    <td className="px-6 py-4">
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