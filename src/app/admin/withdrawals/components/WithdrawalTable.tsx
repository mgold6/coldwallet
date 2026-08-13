"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type WithdrawalStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "DECLINED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

type Withdrawal = {
  id: string;
  amount: {
    toString(): string;
  };
  destinationAddress: string;
  status: WithdrawalStatus;
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

      const actionLabel =
        action === "reject"
          ? "Withdrawal declined"
          : action === "approve"
            ? "Withdrawal approved"
            : "Withdrawal processed";

      toast.success(actionLabel);

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

  function getStatusLabel(status: WithdrawalStatus) {
    switch (status) {
      case "PENDING_REVIEW":
        return "Pending";

      case "APPROVED":
        return "Approved";

      case "DECLINED":
        return "Declined";

      case "PROCESSING":
        return "Processing";

      case "COMPLETED":
        return "Processed";

      case "FAILED":
        return "Failed";

      case "CANCELLED":
        return "Cancelled";

      default:
        return "Unknown";
    }
  }

  function getStatusClass(status: WithdrawalStatus) {
    switch (status) {
      case "PENDING_REVIEW":
        return "text-yellow-400";

      case "APPROVED":
        return "text-green-400";

      case "DECLINED":
        return "text-red-400";

      case "PROCESSING":
        return "text-blue-400";

      case "COMPLETED":
        return "text-cyan-400";

      case "FAILED":
        return "text-red-400";

      case "CANCELLED":
        return "text-slate-400";

      default:
        return "text-slate-400";
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
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
          {withdrawals.map((withdrawal) => {
            const status = withdrawal.status;

            return (
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
                  <span
                    className={`font-semibold ${getStatusClass(status)}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {status === "PENDING_REVIEW" && (
                      <>
                        <button
                          type="button"
                          disabled={loadingId === withdrawal.id}
                          onClick={() =>
                            performAction(
                              withdrawal.id,
                              "approve"
                            )
                          }
                          className="rounded bg-green-600 px-3 py-1 text-sm hover:bg-green-500 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={loadingId === withdrawal.id}
                          onClick={() =>
                            performAction(
                              withdrawal.id,
                              "reject"
                            )
                          }
                          className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-500 disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {status === "APPROVED" && (
                      <button
                        type="button"
                        disabled={loadingId === withdrawal.id}
                        onClick={() =>
                          performAction(
                            withdrawal.id,
                            "process"
                          )
                        }
                        className="rounded bg-cyan-600 px-3 py-1 text-sm hover:bg-cyan-500 disabled:opacity-50"
                      >
                        Process
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}