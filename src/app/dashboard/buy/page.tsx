"use client";

import { useEffect, useState } from "react";


const tokens = [
  {
    symbol: "BTC",
    name: "Bitcoin",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
  },
  {
    symbol: "SOL",
    name: "Solana",
  },
  {
    symbol: "USDT",
    name: "Tether",
  },
];


interface Market {
  symbol: string;
  current_price: number;
}



export default function BuyPage() {


  const [token, setToken] =
    useState("BTC");


  const [amount, setAmount] =
    useState("");



  const [markets, setMarkets] =
    useState<Market[]>([]);



  const [message, setMessage] =
    useState("");





  useEffect(() => {


    async function loadMarkets() {


      const response =
        await fetch("/api/markets");



      if (response.ok) {

        const data =
          await response.json();


        setMarkets(data);

      }

    }



    loadMarkets();


  }, []);







  const market =
    markets.find(
      (coin) =>
        coin.symbol.toUpperCase() === token
    );





  const price =
    market?.current_price ?? 0;





  const usdAmount =
    Number(amount) || 0;





  const receiveAmount =
    price > 0
      ? usdAmount / price
      : 0;







  function handleContinue() {


    setMessage(
      "Payment integration is coming soon."
    );


  }







  return (

    <div className="mx-auto max-w-xl space-y-8">


      <section>


        <h1 className="text-3xl font-bold text-white">
          Buy Crypto
        </h1>


        <p className="mt-2 text-slate-400">
          Purchase digital assets securely.
        </p>


      </section>







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
            Select Asset
          </label>



          <select

            value={token}

            onChange={(e)=>
              setToken(
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

            {tokens.map((item)=>(

              <option
                key={item.symbol}
                value={item.symbol}
              >

                {item.name}
                {" "}
                ({item.symbol})

              </option>

            ))}


          </select>


        </div>








        <div>


          <label className="text-sm text-slate-400">
            Amount (USD)
          </label>



          <input

            value={amount}

            onChange={(e)=>
              setAmount(
                e.target.value
              )
            }


            placeholder="100.00"


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







        <div
          className="
            rounded-xl
            bg-slate-950
            p-4
          "
        >

          <p className="text-sm text-slate-400">
            Current Price
          </p>


          <p className="mt-1 text-xl font-bold text-white">

            $
            {price.toLocaleString(
              undefined,
              {
                minimumFractionDigits:2,
                maximumFractionDigits:2,
              }
            )}

            {" "}

            per {token}

          </p>


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


          <p className="mt-2 text-2xl font-bold text-white">

            {receiveAmount.toLocaleString(
              undefined,
              {
                maximumFractionDigits:8,
              }
            )}

            {" "}

            {token}

          </p>


        </div>








        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-950
            p-4
          "
        >

          <p className="font-semibold text-white">
            Payment Method
          </p>


          <div className="mt-3 space-y-2 text-slate-300">

            <p>○ Bank Transfer</p>

            <p>○ Credit / Debit Card</p>

          </div>


        </div>








        <button

          onClick={handleContinue}

          className="
            w-full
            rounded-xl
            bg-cyan-400
            p-4
            font-semibold
            text-black
          "

        >

          Continue

        </button>







        {message && (

          <div
            className="
              rounded-xl
              bg-slate-950
              p-4
              text-cyan-400
            "
          >

            {message}

          </div>

        )}



      </section>


    </div>

  );

}