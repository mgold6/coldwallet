import { MarketCoin } from "@/types/market";

interface MarketCardProps {
  coin: MarketCoin;
}

export default function MarketCard({ coin }: MarketCardProps) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 transition hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10">

      <div className="flex items-center gap-4">

        <img
          src={coin.image}
          alt={coin.name}
          className="h-12 w-12"
        />

        <div>
          <h3 className="text-xl font-bold text-white">
            {coin.name}
          </h3>

          <p className="uppercase text-gray-400">
            {coin.symbol}
          </p>
        </div>

      </div>

      <div className="mt-6">

        <p className="text-sm text-gray-400">
          Current Price
        </p>

        <h2 className="mt-1 text-3xl font-bold text-white">
          $
          {coin.current_price.toLocaleString()}
        </h2>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">
            24h Change
          </p>

          <p
            className={`font-bold ${
              isPositive
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {coin.price_change_percentage_24h.toFixed(2)}%
          </p>

        </div>

        <div className="text-right">

          <p className="text-sm text-gray-400">
            Rank
          </p>

          <p className="font-bold text-white">
            #{coin.market_cap_rank}
          </p>

        </div>

      </div>

      <div className="mt-6 border-t border-slate-700 pt-4">

        <p className="text-sm text-gray-400">
          Market Cap
        </p>

        <p className="font-semibold text-white">
          $
          {coin.market_cap.toLocaleString()}
        </p>

      </div>

    </div>
  );
}