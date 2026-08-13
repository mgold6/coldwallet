"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MarketCoin {
  symbol: string;
  current_price: number;
}

interface Wallet {
  id: string;
  address: string;
  availableBalance: number | string;
  currency: {
    code: string;
    name: string;
  };
}

interface SendFormProps {
  wallets: Wallet[];
  markets: MarketCoin[];
  withdrawalsEnabled: boolean;
  withdrawalsEnabledMessage: string;
}

export default function SendForm({
  wallets,
  markets,
  withdrawalsEnabled,
  withdrawalsEnabledMessage,
}: SendFormProps) {
  const router = useRouter();

  const [walletId, setWalletId] = useState(
    wallets[0]?.id ?? ""
  );

  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");
  const [loading, setLoading] = useState(false);

  const selectedWallet = wallets.find(
    (wallet) => wallet.id === walletId
  );

  const market = markets.find(
    (coin) =>
      coin.symbol.toLowerCase() ===
      selectedWallet?.currency.code.toLowerCase()
  );

  const numericAmount = Number(amount || 0);

  const usdValue = market
    ? numericAmount * market.current_price
    : 0;

  function clearMessage() {
    setMessage("");
    setMessageType("");
  }

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message]);

  function setMaxAmount() {
    if (!selectedWallet) {
      return;
    }

    setAmount(
      Number(
        selectedWallet.availableBalance
      ).toString()
    );

    clearMessage();
  }

  async function handleSend(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    clearMessage();

    const trimmedAmount = amount.trim();
    const trimmedAddress = toAddress.trim();

    if (!walletId) {
      setMessage("Please select a wallet.");
      setMessageType("error");
      return;
    }

    if (
      !trimmedAmount ||
      !Number.isFinite(Number(trimmedAmount)) ||
      Number(trimmedAmount) <= 0
    ) {
      setMessage(
        "Please enter an amount greater than zero."
      );
      setMessageType("error");
      return;
    }

    if (!selectedWallet) {
      setMessage(
        "The selected wallet could not be found."
      );
      setMessageType("error");
      return;
    }

    const availableBalance = Number(
      selectedWallet.availableBalance
    );

    if (
      !Number.isFinite(availableBalance) ||
      Number(trimmedAmount) > availableBalance
    ) {
      setMessage(
        "The requested amount exceeds your available balance."
      );
      setMessageType("error");
      return;
    }

    if (!trimmedAddress) {
      setMessage(
        "Please enter a recipient address."
      );
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/transactions/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletId,
            amount: trimmedAmount,
            toAddress: trimmedAddress,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to submit withdrawal request."
        );
      }

      setMessage(
        data.message ??
          "Withdrawal request submitted successfully. Your request is pending administrator review."
      );

      setMessageType("success");

      setAmount("");
      setToAddress("");

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit withdrawal request."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSend}
      className="
        space-y-6
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-6
      "
    >
      {withdrawalsEnabled &&
        withdrawalsEnabledMessage.trim() && (
          <div className="rounded-xl border border-cyan-900/50 bg-cyan-950/30 p-4">
            <p className="text-sm text-cyan-300">
              {withdrawalsEnabledMessage}
            </p>
          </div>
        )}

      {/* Asset */}

      <div>
        <label
          htmlFor="asset"
          className="text-sm text-slate-400"
        >
          Asset
        </label>

        <select
          id="asset"
          value={walletId}
          onChange={(e) => {
            setWalletId(e.target.value);
            setAmount("");
            clearMessage();
          }}
          className="
            mt-2
            w-full
            rounded-xl
            bg-slate-950
            p-4
            text-white
          "
        >
          {wallets.map((wallet) => (
            <option
              key={wallet.id}
              value={wallet.id}
            >
              {wallet.currency.name} (
              {wallet.currency.code})
            </option>
          ))}
        </select>
      </div>

      {/* Available Balance */}

      {selectedWallet && (
        <div
          className="
            rounded-xl
            bg-slate-950
            p-4
          "
        >
          <p className="text-sm text-slate-400">
            Available Balance
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            {Number(
              selectedWallet.availableBalance
            ).toLocaleString(undefined, {
              maximumFractionDigits: 8,
            })}{" "}
            {selectedWallet.currency.code}
          </p>
        </div>
      )}

      {/* Amount */}

      <div>
        <label
          htmlFor="amount"
          className="text-sm text-slate-400"
        >
          Amount
        </label>

        <div className="flex gap-3">
          <input
            id="amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              clearMessage();
            }}
            placeholder="0.00"
            className="
              mt-2
              flex-1
              rounded-xl
              bg-slate-950
              p-4
              text-white
            "
          />

          <button
            type="button"
            onClick={setMaxAmount}
            disabled={
              loading || !selectedWallet
            }
            className="
              mt-2
              rounded-xl
              bg-slate-800
              px-5
              text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            MAX
          </button>
        </div>
      </div>

      {/* Estimated Value */}

      <div
        className="
          rounded-xl
          bg-slate-950
          p-4
        "
      >
        <p className="text-sm text-slate-400">
          Estimated Value
        </p>

        <p className="mt-2 text-2xl font-bold text-white">
          $
          {usdValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Recipient Address */}

      <div>
        <label
          htmlFor="recipient"
          className="text-sm text-slate-400"
        >
          Recipient Address
        </label>

        <input
          id="recipient"
          value={toAddress}
          onChange={(e) => {
            setToAddress(e.target.value);
            clearMessage();
          }}
          placeholder="Wallet address"
          className="
            mt-2
            w-full
            rounded-xl
            bg-slate-950
            p-4
            text-white
          "
        />
      </div>

      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-cyan-400
          p-4
          font-semibold
          text-slate-900
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading
          ? "Submitting Request..."
          : "Confirm Send"}
      </button>

      {/* Submission result */}

      {message && (
        <div
          className={`
            rounded-xl
            p-4
            ${
              messageType === "success"
                ? "bg-emerald-950 text-emerald-200"
                : "bg-red-950 text-red-200"
            }
          `}
          role="alert"
        >
          {message}
        </div>
      )}
    </form>
  );
}