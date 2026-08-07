"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


interface SwapInterfaceProps {
  markets: any[];
  wallets: any[];
}



export default function SwapInterface({
  markets,
  wallets,
}: SwapInterfaceProps) {


  const router = useRouter();



  const [fromWallet, setFromWallet] =
    useState(wallets[0]?.id || "");



  const [toWallet, setToWallet] =
    useState(wallets[1]?.id || wallets[0]?.id || "");



  const [amount, setAmount] =
    useState("");



  const [loading, setLoading] =
    useState(false);



  const [message, setMessage] =
    useState("");



  const [showConfirm, setShowConfirm] =
    useState(false);






  const from =
    wallets.find(
      (wallet) =>
        wallet.id === fromWallet
    );



  const to =
    wallets.find(
      (wallet) =>
        wallet.id === toWallet
    );






  const fromMarket =
    markets.find(
      (coin) =>
        coin.symbol.toLowerCase() ===
        from?.currency.code.toLowerCase()
    );



  const toMarket =
    markets.find(
      (coin) =>
        coin.symbol.toLowerCase() ===
        to?.currency.code.toLowerCase()
    );






  const usdValue =
    fromMarket
      ? Number(amount || 0) *
        fromMarket.current_price
      : 0;






  const receiveAmount =
    fromMarket && toMarket
      ? (
          Number(amount || 0) *
          fromMarket.current_price /
          toMarket.current_price
        )
      : 0;






  async function handleSwap() {


    if (!from || !to) return;



    if (fromWallet === toWallet) {

      setMessage(
        "You cannot swap the same asset."
      );

      return;

    }




    if (
      Number(amount) >
      Number(from.availableBalance)
    ) {

      setMessage(
        "Insufficient balance."
      );

      return;

    }





    try {

      setLoading(true);

      setMessage("");



      const response =
        await fetch(
          "/api/transactions/swap",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              fromWalletId:
                fromWallet,

              toWalletId:
                toWallet,

              amount,

            }),

          }
        );





      const data =
        await response.json();





      if (!response.ok) {

        throw new Error(
          data.error ??
          "Swap failed."
        );

      }





      setMessage(
        "Swap completed successfully."
      );



      setAmount("");



      router.refresh();



    } catch(error:any) {


      setMessage(
        error.message ??
        "Unable to complete swap."
      );


    } finally {


      setLoading(false);


    }


  }







  return (

    <section
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
          From
        </label>



        <select

          value={fromWallet}

          onChange={(e)=>
            setFromWallet(
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

          {wallets.map((wallet)=>(

            <option
              key={wallet.id}
              value={wallet.id}
            >

              {wallet.currency.name}
              {" "}
              ({wallet.currency.code})

            </option>

          ))}


        </select>


      </div>






      <div>


        <label className="text-sm text-slate-400">
          Amount
        </label>



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
            w-full
            rounded-xl
            bg-slate-950
            p-4
            text-white
          "

        />



        {from && (

          <p className="mt-2 text-sm text-slate-400">

            Available:
            {" "}
            {Number(
              from.availableBalance
            ).toLocaleString()}

            {" "}

            {from.currency.code}

          </p>

        )}


      </div>







      <div
        className="
          rounded-xl
          bg-slate-950
          p-4
        "
      >

        <p className="text-sm text-slate-400">
          Current Value
        </p>

        <p className="text-xl font-bold text-white">

          $
          {usdValue.toLocaleString(
            undefined,
            {
              minimumFractionDigits:2,
              maximumFractionDigits:2,
            }
          )}

        </p>


      </div>








      <div className="text-center text-2xl text-cyan-400">
        ↓
      </div>








      <div>


        <label className="text-sm text-slate-400">
          Receive
        </label>


        <select

          value={toWallet}

          onChange={(e)=>
            setToWallet(
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

          {wallets.map((wallet)=>(

            <option
              key={wallet.id}
              value={wallet.id}
            >

              {wallet.currency.name}
              {" "}
              ({wallet.currency.code})

            </option>

          ))}


        </select>


      </div>








      <div
        className="
          rounded-xl
          bg-slate-950
          p-4
        "
      >

        <p className="text-sm text-slate-400">
          You Receive
        </p>


        <p className="mt-2 text-xl font-bold text-white">

          {receiveAmount.toLocaleString(
            undefined,
            {
              maximumFractionDigits:8,
            }
          )}

          {" "}

          {to?.currency.code}

        </p>


      </div>








      {message && (

        <div className="rounded-xl bg-slate-950 p-4 text-white">

          {message}

        </div>

      )}








      <button

        onClick={() =>
          setShowConfirm(true)
        }

        className="
          w-full
          rounded-xl
          bg-cyan-400
          p-4
          font-semibold
          text-black
        "

      >

        Review Swap

      </button>








      {showConfirm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">


          <div className="w-full max-w-md rounded-3xl bg-slate-900 p-6">


            <h2 className="text-xl font-bold text-white">
              Confirm Swap
            </h2>


            <div className="mt-5 space-y-4">


              <div className="rounded-xl bg-slate-950 p-4 text-white">

                Send:
                {" "}
                {amount}
                {" "}
                {from?.currency.code}


              </div>


              <div className="rounded-xl bg-slate-950 p-4 text-white">

                Receive:
                {" "}
                {receiveAmount.toFixed(8)}
                {" "}
                {to?.currency.code}

              </div>


            </div>




            <div className="mt-6 flex gap-3">


              <button

                onClick={() =>
                  setShowConfirm(false)
                }

                className="flex-1 rounded-xl bg-slate-700 p-3 text-white"

              >
                Cancel

              </button>



              <button

                onClick={() => {

                  setShowConfirm(false);

                  handleSwap();

                }}

                className="flex-1 rounded-xl bg-cyan-400 p-3 font-semibold text-black"

              >

                {loading
                  ? "Processing..."
                  : "Confirm"
                }

              </button>


            </div>


          </div>


        </div>

      )}



    </section>

  );

}