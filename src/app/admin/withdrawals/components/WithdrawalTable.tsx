"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Withdrawal = {
  id: string;
  amount: {
    toString(): string;
  };
  destinationAddress: string;
  approved: boolean;
  processed: boolean;
  currency: {
    code: string;
  };
  wallet: {
    portfolio: {
      user: {
        name: string | null;
        email: string;
      };
    };
  };
};

interface WithdrawalTableProps {
  withdrawals: Withdrawal[];
}

export default function WithdrawalTable({
  withdrawals,
}: WithdrawalTableProps) {
  const router = useRouter();

  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function performAction(
    withdrawalId: string,
    action: "approve" | "reject" | "process"
  ) {
    try {
      setLoadingId(withdrawalId);

      const response = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          withdrawalId,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Action failed.");
      }

      toast.success(
        `${action.charAt(0).toUpperCase() + action.slice(1)} successful.`
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (withdrawals.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
        No withdrawal requests found.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b border-slate-800">
          <tr className="text-left">
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Currency</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Destination</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {withdrawals.map((withdrawal) => (
            <tr
              key={withdrawal.id}
              className="border-b border-slate-800"
            >
              <td className="px-6 py-4">
                {withdrawal.wallet.portfolio.user.name ??
                  withdrawal.wallet.portfolio.user.email}
              </td>

              <td className="px-6 py-4">
                {withdrawal.currency.code}
              </td>

              <td className="px-6 py-4">
                {withdrawal.amount.toString()}
              </td>

              <td className="px-6 py-4 font-mono text-sm">
                {withdrawal.destinationAddress}
              </td>

              <td className="px-6 py-4">
                {withdrawal.processed ? (
                  <span className="text-cyan-400 font-semibold">
                    Processed
                  </span>
                ) : withdrawal.approved ? (
                  <span className="text-green-400 font-semibold">
                    Approved
                  </span>
                ) : (
                  <span className="text-yellow-400 font-semibold">
                    Pending
                  </span>
                )}
              </td>

              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {!withdrawal.approved && (
                    <>
                      <button
                        disabled={loadingId === withdrawal.id}
                        onClick={() =>
                          performAction(withdrawal.id, "approve")
                        }
                        className="rounded bg-green-600 px-3 py-1 text-sm hover:bg-green-500 disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        disabled={loadingId === withdrawal.id}
                        onClick={() =>
                          performAction(withdrawal.id, "reject")
                        }
                        className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-500 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {withdrawal.approved &&
                    !withdrawal.processed && (
                      <button
                        disabled={loadingId === withdrawal.id}
                        onClick={() =>
                          performAction(withdrawal.id, "process")
                        }
                        className="rounded bg-cyan-600 px-3 py-1 text-sm hover:bg-cyan-500 disabled:opacity-50"
                      >
                        Process
                      </button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}