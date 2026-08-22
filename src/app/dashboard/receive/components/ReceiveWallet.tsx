"use client";

import { useState } from "react";

import TokenSelector from "./TokenSelector";
import WalletQRCode from "./WalletQRCode";
import CopyAddressButton from "./CopyAddressButton";

interface Wallet {
  id: string;
  address: string;
  currency: {
    code: string;
    name: string;
  };
  network?: {
    name: string;
  } | null;
}

interface ReceiveWalletProps {
  wallets: Wallet[];
  initialWalletId?: string;
}

export default function ReceiveWallet({
  wallets,
  initialWalletId,
}: ReceiveWalletProps) {
  const initialWallet =
    wallets.find(
      (wallet) =>
        wallet.id === initialWalletId
    ) ?? wallets[0];

  const [selectedWallet, setSelectedWallet] =
    useState(
      initialWallet?.id ?? ""
    );

  const wallet =
    wallets.find(
      (item) =>
        item.id === selectedWallet
    );

  if (!wallet) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          p-8
          text-center
          text-slate-400
        "
      >
        No wallet available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-slate-400">
          Select Asset
        </p>

        <TokenSelector
          wallets={wallets}
          selectedWallet={selectedWallet}
          onChange={setSelectedWallet}
        />
      </div>

      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >
        <div className="text-center">
          <h2
            className="
              text-3xl
              font-bold
              text-white
            "
          >
            Receive {wallet.currency.code}
          </h2>

          <p className="mt-2 text-slate-400">
            {wallet.currency.name}
          </p>

          <span
            className="
              mt-4
              inline-flex
              rounded-full
              bg-cyan-500/20
              px-4
              py-1
              text-sm
              font-medium
              text-cyan-400
            "
          >
            {wallet.currency.code.toUpperCase()}
          </span>
        </div>

        <div className="mt-8 flex justify-center">
          <WalletQRCode
            address={wallet.address}
          />
        </div>

        <div className="mt-8">
          <p
            className="
              text-sm
              text-slate-400
            "
          >
            Wallet Address
          </p>

          <div
            className="
              mt-2
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-4
              break-all
              font-mono
              text-sm
              text-white
            "
          >
            {wallet.address}
          </div>
        </div>

        <CopyAddressButton
          address={wallet.address}
        />

        <div
          className="
            mt-6
            rounded-xl
            border
            border-yellow-500/30
            bg-yellow-500/10
            p-4
          "
        >
          <p
            className="
              font-semibold
              text-yellow-400
            "
          >
            ⚠️ Important
          </p>

          <p
            className="
              mt-2
              text-sm
              text-slate-300
            "
          >
            Only send {wallet.currency.code} to
            this address. Sending another asset or
            unsupported network may result in
            permanent loss.
          </p>
        </div>
      </section>
    </div>
  );
}