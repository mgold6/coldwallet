import Link from "next/link";
import { dashboardService } from "@/server/services/dashboard.service";

export default async function UsersPage() {
  const users = await dashboardService.getUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          User Management
        </h1>

        <p className="mt-2 text-slate-400">
          Manage user accounts, portfolios, wallets, and balances.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <table className="min-w-full">
          <thead className="border-b border-slate-800">
            <tr className="text-left text-sm text-slate-400">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Portfolios</th>
              <th className="px-6 py-4">Wallets</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const walletCount = user.portfolios.reduce(
                (count, portfolio) => count + portfolio.wallets.length,
                0
              );

              const totalBalance = user.portfolios.reduce(
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
                <tr
                  key={user.id}
                  className="border-b border-slate-800"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold">
                      {user.name ?? "Unnamed User"}
                    </div>

                    <div className="text-sm text-slate-400">
                      {user.email}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {user.role}
                  </td>

                  <td className="px-6 py-4">
                    {user.status}
                  </td>

                  <td className="px-6 py-4">
                    {user.portfolios.length}
                  </td>

                  <td className="px-6 py-4">
                    {walletCount}
                  </td>

                  <td className="px-6 py-4">
                    $
                    {totalBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}