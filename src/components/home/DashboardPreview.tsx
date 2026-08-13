"use client";

import {
  ArrowUpRight,
  Bitcoin,
  ShieldCheck,
  Wallet,
  Activity,
} from "lucide-react";

import PortfolioChart from "./PortfolioChart";
import { useMarket } from "@/hooks/useMarket";

const colors: Record<string, string> = {
  bitcoin: "bg-orange-500",
  ethereum: "bg-indigo-500",
  solana: "bg-purple-500",
  ripple: "bg-blue-500",
  binancecoin: "bg-yellow-500",
  avalanche: "bg-red-500",
  tether: "bg-green-500",
};

export default function DashboardPreview() {
  const { coins, loading } = useMarket();

  const assets = coins.filter((coin) =>
    [
      "bitcoin",
      "ethereum",
      "solana",
      "ripple",
      "binancecoin",
      "avalanche-2",
      "tether",
    ].includes(coin.id)
  );

  return (
    <section className="py-16 sm:py-20 lg:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}

        <div className="mb-10 text-center sm:mb-12">

          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-blue-400 sm:px-5 sm:text-sm">
            PLATFORM PREVIEW
          </span>


          <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:mt-6 sm:text-4xl md:text-5xl">
            Manage Everything in One Secure Dashboard
          </h2>


          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-400 sm:mt-5 sm:text-lg sm:leading-8">
            Organize wallets, monitor your portfolio, track markets,
            and strengthen your digital asset security from one place.
          </p>

        </div>



        {/* Dashboard */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/70 shadow-2xl backdrop-blur-xl">


          {/* Portfolio Header */}

          <div className="border-b border-white/10 p-5 sm:p-8">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>

                <p className="text-slate-400">
  Portfolio Overview
</p>

<h2 className="mt-3 break-words text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
  Track Your Assets
</h2>

<div className="mt-4 flex items-center gap-2 text-blue-400">

  <ArrowUpRight className="h-5 w-5" />

  <span className="font-semibold">
    Organized portfolio insights
  </span>

</div>

              </div>


              <div className="rounded-2xl bg-blue-500/10 p-4 sm:p-5">

                <Wallet className="h-10 w-10 text-blue-400" />

              </div>


            </div>

          </div>




          {/* Content */}

          <div className="grid min-w-0 gap-5 p-4 sm:gap-8 sm:p-6 lg:grid-cols-[1.8fr_1fr] lg:p-8">


            {/* Chart */}

            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-6">

              <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">

                <h3 className="text-lg font-semibold text-white sm:text-xl">
                  Market Performance
                </h3>


                <span className="text-sm text-slate-400">
                  Live Data
                </span>

              </div>


              <PortfolioChart />

            </div>





            {/* Live Assets */}

            <div className="space-y-4">


              {loading && (

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-slate-400">
                  Loading market data...
                </div>

              )}



              {!loading && assets.length === 0 && (

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-slate-400">
                  Market data unavailable
                </div>

              )}




              {assets.map((coin) => (

                <div
                  key={coin.id}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4"
                >

                  <div className="flex min-w-0 items-center gap-3">


                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        colors[coin.id] || "bg-blue-500"
                      }`}
                    >

                      <Bitcoin className="h-5 w-5 text-white" />

                    </div>


                    <div>

                      <p className="break-words font-semibold text-white">
                        {coin.symbol.toUpperCase()}
                      </p>


                      <p className="text-sm text-slate-400">
                        {coin.name}
                      </p>

                    </div>


                  </div>



                  <div className="min-w-0 shrink-0 text-right">

                    <p className="font-semibold text-white">
                      $
                      {coin.current_price.toLocaleString()}
                    </p>


                    <p
                      className={`text-sm ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>

                  </div>


                </div>

              ))}


            </div>


          </div>





          {/* Security Cards */}

          <div className="grid gap-4 border-t border-white/10 p-4 sm:gap-6 sm:p-6 md:grid-cols-3 md:p-8">


            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">

              <div className="flex items-center gap-3">

                <ShieldCheck className="h-6 w-6 text-emerald-400" />

                <div>

                  <p className="font-semibold text-white">
                    Wallet Security
                  </p>


                  <p className="text-sm text-slate-400">
                    100% Protected
                  </p>

                </div>

              </div>

            </div>



            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">

              <div className="flex items-center gap-3">

                <Activity className="h-6 w-6 text-blue-400" />

                <div>

                  <p className="font-semibold text-white">
                    Market Monitoring
                  </p>


                  <p className="text-sm text-slate-400">
                    Live tracking enabled
                  </p>

                </div>

              </div>

            </div>




            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">

              <p className="font-semibold text-white">
                Supported Networks
              </p>


              <p className="mt-3 text-sm leading-7 text-slate-400">
                BTC • ETH • SOL • XRP • BNB • AVAX • USDT
              </p>

            </div>


          </div>



        </div>


      </div>

    </section>
  );
}