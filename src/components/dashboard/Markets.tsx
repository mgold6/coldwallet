"use client";

import Image from "next/image";

interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface MarketsProps {
  markets: MarketCoin[];
}

export default function Markets({
  markets,
}: MarketsProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-bold text-white">
        Live Markets
      </h2>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        {markets.length === 0 ? (
          <div className="bg-slate-950 p-6 text-center text-slate-400">
            Market data unavailable.
          </div>
        ) : (
          <>
            <div
              className="
                grid
                grid-cols-3
                border-b
                border-slate-800
                bg-slate-950
                px-5
                py-3
                text-sm
                text-slate-400
              "
            >
              <span>Asset</span>

              <span className="text-right">
                Price
              </span>

              <span className="text-right">
                24H
              </span>
            </div>

            {markets.map((coin) => (
              <div
                key={coin.id}
                className="
                  grid
                  grid-cols-3
                  items-center
                  border-b
                  border-slate-800
                  px-5
                  py-4
                  transition
                  hover:bg-slate-800/50
                "
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full"
                  />

                  <div>
                    <p className="font-semibold text-white">
                      {coin.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {coin.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-white">
                    $
                    {coin.current_price.toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-sm
                      ${
                        coin.price_change_percentage_24h >= 0
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    `}
                  >
                    {coin.price_change_percentage_24h >= 0
                      ? "+"
                      : ""}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}