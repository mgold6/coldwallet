"use client";

import Image from "next/image";
import { useMarket } from "@/hooks/useMarket";

export default function CryptoTicker() {
  const { coins, loading } = useMarket();

  if (loading) {
    return (
      <div className="border-b border-white/10 bg-black px-6 py-3 text-sm text-slate-400">
        Loading live market data...
      </div>
    );
  }

  const tickerCoins = [...coins, ...coins];

  return (
    <div className="w-full overflow-hidden border-b border-white/10 bg-black">
      <div className="flex animate-scroll gap-10 whitespace-nowrap px-6 py-3 hover:[animation-play-state:paused]">
        {tickerCoins.map((coin, index) => {
          const positive =
            coin.price_change_percentage_24h >= 0;

          return (
            <div
              key={`${coin.id}-${index}`}
              className="flex items-center gap-3"
            >
              <Image
                src={coin.image}
                alt={coin.name}
                width={20}
                height={20}
                className="h-5 w-5"
              />

              <span className="font-semibold uppercase text-white">
                {coin.symbol}
              </span>

              <span className="text-slate-300">
                ${coin.current_price.toLocaleString()}
              </span>

              <span
                className={
                  positive
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {positive ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}