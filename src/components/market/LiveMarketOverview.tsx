"use client";

import MarketCard from "./MarketCard";
import { useMarket } from "@/hooks/useMarket";
import SectionTitle from "@/components/ui/SectionTitle";

export default function LiveMarketOverview() {
  const { coins, loading, error } = useMarket();

  return (
    <section className="bg-[#05070D] py-28">
      <div className="mx-auto max-w-7xl px-8">

        <SectionTitle
          badge="LIVE MARKET"
          title="Live Cryptocurrency Market"
          description="Real-time cryptocurrency market data powered by CoinGecko."
        />

        {loading && (
          <div className="py-20 text-center text-gray-400">
            Loading market data...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500 bg-red-500/10 p-6 text-center text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {coins.map((coin) => (
              <MarketCard
                key={coin.id}
                coin={coin}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}