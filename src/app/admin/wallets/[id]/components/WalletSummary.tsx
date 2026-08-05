"use client";

import { useState } from "react";

import WalletEditModal from "./WalletEditModal";

interface WalletSummaryProps {
  wallet: any;
}

export default function WalletSummary({
  wallet,
}: WalletSummaryProps) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Wallet Information
          </h2>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
          >
            Edit Wallet
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-slate-400">
              Wallet Address
            </p>

            <p className="mt-1 break-all font-mono text-sm">
              {wallet.address}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-400">
                Balance
              </p>

              <p className="mt-1 text-2xl font-bold">
                {wallet.balance.toString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Status
              </p>

              <p className="mt-1">
                {wallet.status}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-400">
                Currency
              </p>

              <p className="mt-1">
                {wallet.currency.code}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Network
              </p>

              <p className="mt-1">
                {wallet.network?.name ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <WalletEditModal
        wallet={wallet}
        open={editing}
        onClose={() => setEditing(false)}
      />
    </>
  );
}