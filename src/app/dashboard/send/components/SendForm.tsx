"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MarketCoin {
  symbol: string;
  current_price: number;
}

interface Wallet {
  id: string;
  address: string;
  availableBalance: any;
  currency: {
    code: string;
    name: string;
  };
}

interface SendFormProps {
  wallets: Wallet[];
  markets: MarketCoin[];
}

export default function SendForm({
  wallets,
  markets,
}: SendFormProps) {

  const router = useRouter();

  const [walletId, setWalletId] = useState(
    wallets[0]?.id ?? ""
  );

  const [amount, setAmount] = useState("");

  const [toAddress, setToAddress] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  const selectedWallet =
    wallets.find(
      (wallet) =>
        wallet.id === walletId
    );


  const market =
    markets.find(
      (coin) =>
        coin.symbol.toLowerCase() ===
        selectedWallet?.currency.code.toLowerCase()
    );


  const usdValue =
    market
      ? Number(amount || 0) *
        market.current_price
      : 0;


  function setMaxAmount() {

    if (!selectedWallet) return;


    setAmount(
      Number(
        selectedWallet.availableBalance
      ).toString()
    );

  }


  async function handleSend(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setMessage("");


    if (!walletId || !amount || !toAddress) {

      setMessage(
        "Please complete all fields."
      );

      return;

    }


    if (
      Number(amount) >
      Number(selectedWallet?.availableBalance)
    ) {

      setMessage(
        "Insufficient balance."
      );

      return;

    }


    try {

      setLoading(true);


      const response =
        await fetch(
          "/api/transactions/send",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              walletId,

              amount,

              toAddress,

            }),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ??
          "Transaction failed."
        );

      }


      setMessage(
        "Transaction sent successfully."
      );


      setAmount("");

      setToAddress("");

      router.refresh();


    } catch(error:any) {

      setMessage(
        error.message ??
        "Unable to send transaction."
      );


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


      <div>

        <label className="text-sm text-slate-400">
          Asset
        </label>


        <select

          value={walletId}

          onChange={(e)=>
            setWalletId(
              e.target.value
            )
          }

          className="
            mt-2
            w-full
            rounded-xl
            bg-slate-950
            p-4
            text-white
          "

        >

          {
            wallets.map((wallet)=>(

              <option
                key={wallet.id}
                value={wallet.id}
              >

                {wallet.currency.name}
                {" "}
                ({wallet.currency.code})

              </option>

            ))
          }

        </select>

      </div>




      {
        selectedWallet && (

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

              {
                Number(
                  selectedWallet.availableBalance
                ).toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits:8
                  }
                )
              }

              {" "}

              {selectedWallet.currency.code}

            </p>

          </div>

        )
      }




      <div>

        <label className="text-sm text-slate-400">
          Amount
        </label>


        <div className="flex gap-3">

          <input

            value={amount}

            onChange={(e)=>
              setAmount(
                e.target.value
              )
            }

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

            className="
              mt-2
              rounded-xl
              bg-slate-800
              px-5
              text-white
            "

          >

            MAX

          </button>

        </div>

      </div>




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
          {
            usdValue.toLocaleString(
              undefined,
              {
                minimumFractionDigits:2,
                maximumFractionDigits:2,
              }
            )
          }

        </p>

      </div>




      <div>

        <label className="text-sm text-slate-400">
          Recipient Address
        </label>


        <input

          value={toAddress}

          onChange={(e)=>
            setToAddress(
              e.target.value
            )
          }

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
            <button

        disabled={loading}

        className="
          w-full
          rounded-xl
          bg-cyan-400
          p-4
          font-semibold
          text-slate-900
        "

      >

        {
          loading
          ?
          "Processing..."
          :
          "Confirm Send"
        }

      </button>




      {
        message && (

          <div
            className="
              rounded-xl
              bg-slate-950
              p-4
              text-white
            "
          >

            {message}

          </div>

        )
      }


    </form>

  );

}