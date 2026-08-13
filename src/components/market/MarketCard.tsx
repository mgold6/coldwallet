import Image from "next/image";
import { MarketCoin } from "@/types/market";

interface MarketCardProps {
  coin: MarketCoin;
}

export default function MarketCard({
  coin,
}: MarketCardProps) {
  const isPositive =
    coin.price_change_percentage_24h >= 0;

  return (
    <div className="min-w-0 rounded-2xl border border-slate-800 bg-[#111827] p-4 transition hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 sm:p-6">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Image
          src={coin.image}
          alt={coin.name}
          width={48}
          height={48}
          className="h-10 w-10 shrink-0 sm:h-12 sm:w-12"
        />

        <div>
          <h3 className="truncate text-lg font-bold text-white sm:text-xl">
            {coin.name}
          </h3>

          <p className="uppercase text-gray-400">
            {coin.symbol}
          </p>
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
        <p className="text-sm text-gray-400">
          Current Price
        </p>

        <h2 className="mt-1 break-words text-2xl font-bold text-white sm:text-3xl">
          $
          {coin.current_price.toLocaleString()}
        </h2>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
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