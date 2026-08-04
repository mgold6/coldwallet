import { dashboardService } from "@/server/services/dashboard.service";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function UsersTable() {
  const users = await dashboardService.getUsers();

  return (
    <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">
          Registered Users
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Manage users and assign wallet addresses.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Portfolios</TableHead>
            <TableHead>Wallets</TableHead>
            <TableHead className="text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const walletCount = user.portfolios.reduce(
              (count, portfolio) =>
                count + portfolio.wallets.length,
              0
            );

            return (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName || user.lastName
                    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                    : "—"}
                </TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>
                  <Badge>{user.role}</Badge>
                </TableCell>

                <TableCell>
                  <Badge>{user.status}</Badge>
                </TableCell>

                <TableCell>
                  {user.portfolios.length}
                </TableCell>

                <TableCell>
                  {walletCount}
                </TableCell>

                <TableCell className="text-right">
                  <Button size="sm">
                    Assign Wallet
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}