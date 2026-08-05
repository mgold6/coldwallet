"use client";

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
    <section className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      <h2 className="text-2xl font-semibold text-white">
        Live Markets
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Cryptocurrency prices updated automatically
      </p>

      <div className="mt-6 space-y-3">
        {markets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-cyan-500/30 bg-[#0B0F19] p-6 text-center text-gray-400">
            Market data unavailable.
          </div>
        ) : (
          markets.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between rounded-xl bg-[#0B0F19] p-4 transition hover:bg-[#111827]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-8 w-8"
                />

                <div>
                  <p className="font-semibold text-white">
                    {coin.symbol.toUpperCase()}
                  </p>

                  <p className="text-xs text-gray-400">
                    {coin.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
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
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}