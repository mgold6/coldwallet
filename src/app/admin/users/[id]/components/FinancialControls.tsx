"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FinancialControlsProps {
  userId: string;
  withdrawalsEnabled: boolean;
  manualFundsWithdrawable: boolean;
  withdrawalRestrictionMessage: string | null;
  manualFundsRestrictionMessage: string | null;
}

export default function FinancialControls({
  userId,
  withdrawalsEnabled,
  manualFundsWithdrawable,
  withdrawalRestrictionMessage,
  manualFundsRestrictionMessage,
}: FinancialControlsProps) {
  const router = useRouter();

  const [withdrawals, setWithdrawals] =
    useState(withdrawalsEnabled);

  const [manualFunds, setManualFunds] =
    useState(manualFundsWithdrawable);

  const [restrictionMessage, setRestrictionMessage] =
    useState(
      withdrawalRestrictionMessage ?? ""
    );

  const [
    manualFundsRestrictionMessageValue,
    setManualFundsRestrictionMessageValue,
  ] = useState(
    manualFundsRestrictionMessage ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function saveControls() {
    setSaving(true);
    setStatus("Saving...");

    try {
      const response = await fetch(
        `/api/admin/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            withdrawalsEnabled: withdrawals,
            manualFundsWithdrawable: manualFunds,
            withdrawalRestrictionMessage:
              restrictionMessage.trim() || null,
            manualFundsRestrictionMessage:
              manualFundsRestrictionMessageValue.trim() ||
              null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to save financial controls."
        );
      }

      setStatus("Financial controls saved.");
      router.refresh();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to save financial controls."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Financial Controls
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          These controls apply to this individual user across all of their portfolios.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <span className="block text-sm font-medium text-white">
            Normal Withdrawals
          </span>

          <span className="mt-1 block text-xs text-slate-500">
            Allow this user to submit normal withdrawal requests from their available blockchain funds.
          </span>

          <select
            value={
              withdrawals
                ? "enabled"
                : "disabled"
            }
            onChange={(event) =>
              setWithdrawals(
                event.target.value === "enabled"
              )
            }
            disabled={saving}
            className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white"
          >
            <option value="enabled">
              Enabled
            </option>

            <option value="disabled">
              Disabled
            </option>
          </select>
        </label>

        <label className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <span className="block text-sm font-medium text-white">
            Manual / Internal Funds
          </span>

          <span className="mt-1 block text-xs text-slate-500">
            Allow this user to withdraw manual or internally credited funds.
          </span>

          <select
            value={
              manualFunds
                ? "enabled"
                : "disabled"
            }
            onChange={(event) =>
              setManualFunds(
                event.target.value === "enabled"
              )
            }
            disabled={saving}
            className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white"
          >
            <option value="disabled">
              Disabled
            </option>

            <option value="enabled">
              Enabled
            </option>
          </select>
        </label>
      </div>

      <div className="mt-5">
        <label
          htmlFor="withdrawal-restriction-message"
          className="block text-sm font-medium text-white"
        >
          Normal Withdrawal Restriction Message
        </label>

        <p className="mt-1 text-xs text-slate-500">
          Message shown to this user when normal withdrawals are disabled.
        </p>

        <textarea
          id="withdrawal-restriction-message"
          value={restrictionMessage}
          onChange={(event) =>
            setRestrictionMessage(
              event.target.value
            )
          }
          rows={4}
          disabled={saving}
          placeholder="Enter a user-specific normal withdrawal restriction message..."
          className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-white outline-none focus:border-cyan-400"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="manual-funds-restriction-message"
          className="block text-sm font-medium text-white"
        >
          Manual Funds Restriction Message
        </label>

        <p className="mt-1 text-xs text-slate-500">
          Message shown to this user when manual or internal funds are not available for withdrawal.
        </p>

        <textarea
          id="manual-funds-restriction-message"
          value={
            manualFundsRestrictionMessageValue
          }
          onChange={(event) =>
            setManualFundsRestrictionMessageValue(
              event.target.value
            )
          }
          rows={4}
          disabled={saving}
          placeholder="Enter a user-specific manual funds restriction message..."
          className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-white outline-none focus:border-cyan-400"
        />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={saveControls}
          disabled={saving}
          className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Financial Controls"}
        </button>

        {status && (
          <p className="text-sm text-cyan-400">
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
