"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import WalletEditModal from "./WalletEditModal";

interface WalletSummaryProps {
  wallet: any;
}

export default function WalletSummary({
  wallet,
}: WalletSummaryProps) {
  const [editing, setEditing] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(wallet.address);
      toast.success("Wallet address copied.");
    } catch {
      toast.error("Unable to copy wallet address.");
    }
  }

  function getExplorerUrl() {
    const network =
      wallet.network?.name?.toLowerCase() ?? "";

    const currency =
      wallet.currency.code.toUpperCase();

    if (currency === "BTC") {
      return `https://www.blockchain.com/explorer/addresses/btc/${wallet.address}`;
    }

    if (
      currency === "ETH" ||
      currency === "USDT"
    ) {
      return `https://etherscan.io/address/${wallet.address}`;
    }

    if (currency === "SOL") {
      return `https://solscan.io/account/${wallet.address}`;
    }

    if (currency === "XRP") {
      return `https://xrpscan.com/account/${wallet.address}`;
    }

    if (currency === "ADA") {
      return `https://cardanoscan.io/address/${wallet.address}`;
    }

    if (currency === "DOGE") {
      return `https://dogechain.info/address/${wallet.address}`;
    }

    if (currency === "LTC") {
      return `https://blockchair.com/litecoin/address/${wallet.address}`;
    }

    if (network.includes("bep")) {
      return `https://bscscan.com/address/${wallet.address}`;
    }

    if (network.includes("avax")) {
      return `https://snowtrace.io/address/${wallet.address}`;
    }

    return "#";
  }

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

        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-white p-3">
            <QRCode
              value={wallet.address}
              size={150}
            />
          </div>

          <button
            onClick={copyAddress}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
          >
            📋 Copy Address
          </button>

          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm text-cyan-400 hover:underline"
          >
            🌐 View on Blockchain Explorer
          </a>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <p className="text-sm text-slate-400">
              Wallet Address
            </p>

            <p className="mt-1 break-all rounded-lg bg-slate-800 p-3 font-mono text-sm">
              {wallet.address}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-400">
                Balance
              </p>

              <p className="mt-1 text-3xl font-bold">
                {Number(wallet.balance).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Status
              </p>

              <span className="inline-flex rounded-full bg-green-600 px-3 py-1 text-sm font-medium text-white">
                {wallet.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-400">
                Currency
              </p>

              <span className="inline-flex rounded-full bg-cyan-600 px-3 py-1 text-sm font-medium text-white">
                {wallet.currency.code}
              </span>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Network
              </p>

              <span className="inline-flex rounded-full bg-indigo-600 px-3 py-1 text-sm font-medium text-white">
                {wallet.network?.name ?? "—"}
              </span>
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