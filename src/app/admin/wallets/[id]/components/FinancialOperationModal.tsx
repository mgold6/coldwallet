"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FinancialOperationModalProps {
  walletId: string;
  operation:
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "ADJUSTMENT";
  open: boolean;
  onClose: () => void;
}

type TransactionSource =
  | "INTERNAL"
  | "TESTNET"
  | "BLOCKCHAIN_IMPORT";

type BalanceEffect =
  | "UPDATE"
  | "RECORD_ONLY";

export default function FinancialOperationModal({
  walletId,
  operation,
  open,
  onClose,
}: FinancialOperationModalProps) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [destinationAddress, setDestinationAddress] =
    useState("");

  const [transactionSource, setTransactionSource] =
    useState<TransactionSource>("INTERNAL");

  const [balanceEffect, setBalanceEffect] =
    useState<BalanceEffect>("UPDATE");

  const [showInHistory, setShowInHistory] =
    useState(true);

  const [sendNotification, setSendNotification] =
    useState(false);

  const [
    sendEmailNotification,
    setSendEmailNotification,
  ] = useState(false);

  const [txHash, setTxHash] = useState("");
  const [blockchainNetwork, setBlockchainNetwork] =
    useState("");
  const [explorerUrl, setExplorerUrl] = useState("");
  const [blockchainVerified, setBlockchainVerified] =
    useState(false);

  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const isBlockchainSource =
    transactionSource === "TESTNET" ||
    transactionSource === "BLOCKCHAIN_IMPORT";

  const isInternalSource =
    transactionSource === "INTERNAL";

  const operationTitle =
    operation === "DEPOSIT"
      ? "Deposit Funds"
      : operation === "WITHDRAWAL"
        ? "Withdraw Funds"
        : "Adjust Balance";

  const sourceDescription =
    isInternalSource
      ? "Internal / manual funds are credited to the internal balance."
      : "Testnet and blockchain-imported funds are treated as blockchain-backed funds.";

  async function submit() {
    const numericAmount = Number(amount);

    if (!amount || !Number.isFinite(numericAmount)) {
      alert("Please enter a valid amount.");
      return;
    }

    if (numericAmount === 0) {
      alert("Amount cannot be zero.");
      return;
    }

    if (
      operation === "WITHDRAWAL" &&
      numericAmount < 0
    ) {
      alert(
        "Withdrawal amount must be greater than zero."
      );
      return;
    }

    if (
      operation === "DEPOSIT" &&
      numericAmount < 0
    ) {
      alert(
        "Deposit amount must be greater than zero."
      );
      return;
    }

    if (
      operation === "WITHDRAWAL" &&
      !destinationAddress.trim()
    ) {
      alert(
        "Please enter the destination wallet address."
      );
      return;
    }

    if (
      isBlockchainSource &&
      blockchainNetwork.trim() === ""
    ) {
      alert(
        "Please enter the blockchain network for blockchain-backed funds."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/financial",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: operation,
            walletId,
            amount: numericAmount,
            notes: notes.trim(),
            destinationAddress:
              destinationAddress.trim(),
            transactionSource,
            balanceEffect,
            showInHistory,
            sendNotification,
            sendEmailNotification,
            txHash: txHash.trim() || undefined,
            blockchainNetwork:
              blockchainNetwork.trim() || undefined,
            explorerUrl:
              explorerUrl.trim() || undefined,
            blockchainVerified:
              isBlockchainSource
                ? blockchainVerified
                : false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Financial operation failed."
        );
      }

      alert(
        `${operationTitle} completed successfully.`
      );

      router.refresh();
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Financial operation failed.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        p-6
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-3xl
          bg-slate-900
          p-6
          shadow-2xl
        "
      >
        <div>
          <h2 className="text-xl font-bold text-white">
            {operationTitle}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Configure how this administrator financial
            operation should affect the wallet. Amounts
            are entered in USD and converted using the
            selected wallet currency's current market price.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              USD Amount
            </label>

            <input
              type="number"
              min={
                operation === "ADJUSTMENT"
                  ? undefined
                  : "0"
              }
              step="any"
              placeholder="0.00 USD"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                p-3
                text-white
                outline-none
                focus:border-cyan-400
              "
            />

            {operation === "ADJUSTMENT" && (
              <p className="mt-2 text-xs text-slate-500">
                Use a positive amount to add funds or a
                negative amount to remove funds.
              </p>
            )}
          </div>

          {/* Fund Source */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Fund Source
            </label>

            <select
              value={transactionSource}
              onChange={(event) =>
                setTransactionSource(
                  event.target.value as TransactionSource
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                p-3
                text-white
                outline-none
                focus:border-cyan-400
              "
            >
              <option value="INTERNAL">
                Internal / Manual Funds
              </option>


              <option value="TESTNET">
                Testnet
              </option>

              <option value="BLOCKCHAIN_IMPORT">
                Blockchain Import
              </option>
            </select>

            <p className="mt-2 text-xs text-slate-500">
              {sourceDescription}
            </p>
          </div>

          {/* Balance Effect */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Balance Effect
            </label>

            <select
              value={balanceEffect}
              onChange={(event) =>
                setBalanceEffect(
                  event.target.value as BalanceEffect
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                p-3
                text-white
                outline-none
                focus:border-cyan-400
              "
            >
              <option value="UPDATE">
                Update Wallet Balance
              </option>

              <option value="RECORD_ONLY">
                Record Transaction Only
              </option>
            </select>

            <p className="mt-2 text-xs text-slate-500">
              {balanceEffect === "UPDATE"
                ? "The selected fund bucket and wallet balance will be updated."
                : "A transaction record will be created without changing the wallet balance."}
            </p>
          </div>

          {/* Withdrawal destination */}
          {operation === "WITHDRAWAL" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Destination Wallet Address
              </label>

              <input
                placeholder="Enter destination address"
                value={destinationAddress}
                onChange={(event) =>
                  setDestinationAddress(
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  p-3
                  text-white
                  outline-none
                  focus:border-cyan-400
                "
              />
            </div>
          )}

          {/* Blockchain metadata */}
          {isBlockchainSource && (
            <div
              className="
                space-y-4
                rounded-2xl
                border
                border-slate-700
                bg-slate-950/50
                p-4
              "
            >
              <div>
                <h3 className="font-medium text-white">
                  Blockchain Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  These fields describe the blockchain-backed
                  or Testnet transaction.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Blockchain Network
                </label>

                <input
                  placeholder="e.g. Bitcoin Testnet, Sepolia, Solana Devnet"
                  value={blockchainNetwork}
                  onChange={(event) =>
                    setBlockchainNetwork(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900
                    p-3
                    text-white
                    outline-none
                    focus:border-cyan-400
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  TX Hash
                </label>

                <input
                  placeholder="Optional transaction hash"
                  value={txHash}
                  onChange={(event) =>
                    setTxHash(event.target.value)
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900
                    p-3
                    text-white
                    outline-none
                    focus:border-cyan-400
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Explorer URL
                </label>

                <input
                  type="url"
                  placeholder="Optional blockchain explorer URL"
                  value={explorerUrl}
                  onChange={(event) =>
                    setExplorerUrl(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900
                    p-3
                    text-white
                    outline-none
                    focus:border-cyan-400
                  "
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={blockchainVerified}
                  onChange={(event) =>
                    setBlockchainVerified(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4"
                />

                Blockchain transaction verified
              </label>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Notes
            </label>

            <textarea
              rows={4}
              placeholder="Optional notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                p-3
                text-white
                outline-none
                focus:border-cyan-400
              "
            />
          </div>

          {/* History */}
          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={showInHistory}
              onChange={(event) =>
                setShowInHistory(
                  event.target.checked
                )
              }
              className="h-4 w-4"
            />

            Show in user transaction history
          </label>

          {/* In-app notification */}
          <label className="flex items-center gap-3 text-sm text-white">
            <input
              type="checkbox"
              checked={sendNotification}
              onChange={(event) =>
                setSendNotification(
                  event.target.checked
                )
              }
              className="h-4 w-4"
            />

            Send in-app notification
          </label>

          {/* Email notification — deposits only */}
          {operation === "DEPOSIT" && (
            <label className="flex items-center gap-3 text-sm text-white">
              <input
                type="checkbox"
                checked={sendEmailNotification}
                onChange={(event) =>
                  setSendEmailNotification(
                    event.target.checked
                  )
                }
                className="h-4 w-4"
              />

              Send email notification
            </label>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex-1
              rounded-xl
              bg-slate-700
              p-3
              font-medium
              text-white
              hover:bg-slate-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="
              flex-1
              rounded-xl
              bg-cyan-400
              p-3
              font-semibold
              text-black
              hover:bg-cyan-300
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Processing..."
              : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}