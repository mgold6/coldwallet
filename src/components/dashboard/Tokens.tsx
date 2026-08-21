"use client";

import Link from "next/link";

interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h?: number;
  price_change_percentage_24h: number;
}

interface Wallet {
  id: string;
  balance: string | number;
  availableBalance?: string | number;
  currency: {
    code: string;
    name: string;
  };
}

interface TokensProps {
  markets: MarketCoin[];
  wallets: Wallet[];
}

type WalletMap = Record<string, Wallet>;

const supportedTokens = [
  "BTC",
  "ETH",
  "SOL",
  "XRP",
  "USDT",
  "ADA",
  "BNB",
  "AVAX",
  "DOGE",
  "LTC",
];

export default function Tokens({
  markets,
  wallets,
}: TokensProps) {
  const walletMap = wallets.reduce<WalletMap>(
    (acc, wallet) => {
      acc[wallet.currency.code.toUpperCase()] = wallet;
      return acc;
    },
    {}
  );

  const tokens = supportedTokens.map((symbol) => {
    const wallet = walletMap[symbol];

    const market = markets.find(
      (coin) =>
        coin.symbol.toUpperCase() === symbol
    );

    const balance = wallet
      ? Number(
          wallet.balance ??
            wallet.availableBalance ??
            0
        )
      : 0;

    const currentPrice = market
      ? Number(market.current_price ?? 0)
      : 0;

    /*
     * Current token value:
     *
     * wallet balance × current live market price
     */
    const value = balance * currentPrice;

    /*
     * CoinGecko already provides the actual
     * 24H price movement in USD.
     *
     * Therefore:
     *
     * wallet balance × 24H price change
     *
     * gives the actual 24H dollar change
     * for this token.
     */
    const priceChange24h = market
      ? Number(market.price_change_24h ?? 0)
      : 0;

    const change = balance * priceChange24h;

    /*
     * Use the market's supplied 24H percentage
     * for the token percentage display.
     */
    const changePercentage = market
      ? Number(
          market.price_change_percentage_24h ?? 0
        )
      : 0;

    return {
      symbol,
      name: wallet?.currency.name ?? symbol,
      balance,
      value,
      change,
      changePercentage,
      currentPrice,
      market,
    };
  });

  return (
    <section>
      <h2
        className="
          mb-5
          text-2xl
          font-bold
          text-white
        "
      >
        Tokens
      </h2>

      <div className="space-y-4">
        {tokens.map((token) => (
          <Link
            key={token.symbol}
            href={`/dashboard/assets/${token.symbol}`}
            className="
              block
              rounded-2xl
              border
              border-slate-800
              bg-slate-950
              p-5
              transition
              hover:bg-slate-900
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              {/* LEFT: icon, name, balance */}
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-800
                  "
                >
                  {token.market ? (
                    <img
                      src={token.market.image}
                      alt={token.name}
                      className="h-9 w-9"
                    />
                  ) : (
                    <span
                      className="
                        text-xl
                        text-cyan-400
                      "
                    >
                      ◉
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3
                    className="
                      truncate
                      font-semibold
                      text-white
                    "
                  >
                    {token.name}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-slate-400
                    "
                  >
                    {token.balance.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 8,
                      }
                    )}{" "}
                    {token.symbol}
                  </p>
                </div>
              </div>

              {/* RIGHT: current value + 24H change */}
              <div className="shrink-0 text-right">
                <p
                  className="
                    text-lg
                    font-bold
                    text-white
                  "
                >
                  $
                  {token.value.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
<p
                  className="
                    mt-1
                    text-sm
                    font-medium
                    text-green-400
                  "
                >
                  $
                  {token.currentPrice.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits:
                        token.currentPrice >= 1
                          ? 2
                          : 4,
                      maximumFractionDigits:
                        token.currentPrice >= 1
                          ? 2
                          : 8,
                    }
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
