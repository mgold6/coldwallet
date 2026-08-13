import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function RecentActivity() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const userId = session.user.id;

  const transactions =
    await prisma.transaction.findMany({
      where: {
        wallet: {
          portfolio: {
            userId,
          },
        },
      },
      include: {
        currency: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="rounded-xl bg-[#0B0F19] p-4">
            <p className="font-medium text-white">
              No activity yet
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Your recent deposits, withdrawals, and transfers will appear here.
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-xl bg-[#0B0F19] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">
                  {transaction.type}
                </p>

                <p className="text-sm text-cyan-400">
                  {transaction.amount.toString()}{" "}
                  {transaction.currency.code}
                </p>
              </div>

              <p className="mt-1 text-sm text-gray-400">
                {transaction.status}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                {transaction.createdAt.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}