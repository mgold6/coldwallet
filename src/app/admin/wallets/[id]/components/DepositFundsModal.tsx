"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DepositFundsModalProps {
  walletId: string;
  open: boolean;
  onClose: () => void;
}

export default function DepositFundsModal({
  walletId,
  open,
  onClose,
}: DepositFundsModalProps) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleDeposit() {
    if (!amount) {
      alert("Please enter an amount.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/financial",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "deposit",
            walletId,
            amount: Number(amount),
            notes,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.message ?? "Deposit failed."
        );
      }

      router.refresh();

      onClose();
    } catch (error) {
      console.error(error);

      alert("Unable to complete deposit.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white">
          Deposit Funds
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Amount
            </label>

            <input
              type="number"
              step="0.00000001"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Notes
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleDeposit}
            disabled={saving}
            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500 disabled:opacity-50"
          >
            {saving
              ? "Processing..."
              : "Deposit Funds"}
          </button>
        </div>
      </div>
    </div>
  );
}