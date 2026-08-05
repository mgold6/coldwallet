"use client";

import { useState } from "react";

import DepositFundsModal from "./DepositFundsModal";

interface WalletFinancialOperationsProps {
  walletId: string;
}

export default function WalletFinancialOperations({
  walletId,
}: WalletFinancialOperationsProps) {
  const [depositOpen, setDepositOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Financial Operations
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Manage deposits, withdrawals and balance adjustments.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDepositOpen(true)}
            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-500"
          >
            Deposit Funds
          </button>

          <button
            type="button"
            disabled
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white opacity-50"
          >
            Withdraw Funds
          </button>

          <button
            type="button"
            disabled
            className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white opacity-50"
          >
            Adjust Balance
          </button>
        </div>
      </div>

      <DepositFundsModal
        walletId={walletId}
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
      />
    </>
  );
}