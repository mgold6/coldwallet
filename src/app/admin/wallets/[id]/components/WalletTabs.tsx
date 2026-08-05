"use client";

import { useState } from "react";

interface WalletTabsProps {
  overview: React.ReactNode;
  deposits: React.ReactNode;
  withdrawals: React.ReactNode;
  transactions: React.ReactNode;
}

type Tab =
  | "overview"
  | "deposits"
  | "withdrawals"
  | "transactions";

export default function WalletTabs({
  overview,
  deposits,
  withdrawals,
  transactions,
}: WalletTabsProps) {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: {
    id: Tab;
    label: string;
  }[] = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "deposits",
      label: "Deposits",
    },
    {
      id: "withdrawals",
      label: "Withdrawals",
    },
    {
      id: "transactions",
      label: "Transactions",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex border-b border-slate-800">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-6 py-4 text-sm font-medium transition ${
              tab === item.id
                ? "border-b-2 border-cyan-500 text-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "overview" && overview}
        {tab === "deposits" && deposits}
        {tab === "withdrawals" && withdrawals}
        {tab === "transactions" && transactions}
      </div>
    </div>
  );
}