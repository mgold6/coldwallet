"use client";

import Link from "next/link";

interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface Wallet {
  id: string;
  balance: any;
  availableBalance?: any;

  currency: {
    code: string;
    name: string;
  };
}

interface TokensProps {
  markets: MarketCoin[];
  wallets: Wallet[];
}

export default function Tokens({
  markets,
  wallets,
}: TokensProps) {
  const groupedWallets = Object.values(
    wallets.reduce(
      (
        acc: Record<string, Wallet>,
        wallet
      ) => {
        const code = wallet.currency.code;

        if (!acc[code]) {
          acc[code] = {
            ...wallet,
            balance: Number(
              wallet.balance ??
              wallet.availableBalance ??
              0
            ),
          };
        } else {
          acc[code].balance =
            Number(acc[code].balance) +
            Number(
              wallet.balance ??
              wallet.availableBalance ??
              0
            );
        }

        return acc;
      },
      {}
    )
  );

  return (
    <section
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-6
      "
    >
      <h2
        className="
          mb-6
          text-2xl
          font-bold
          text-white
        "
      >
        Tokens
      </h2>

      <div className="space-y-3">
        {groupedWallets.length === 0 ? (
          <div
            className="
              rounded-2xl
              bg-slate-950
              p-8
              text-center
              text-slate-400
            "
          >
            <p className="text-lg text-white">
              No assets yet
            </p>

            <p className="mt-2 text-sm">
              Deposit crypto or connect a wallet
              to start managing your portfolio.
            </p>
          </div>
        ) : (
          groupedWallets.map((wallet) => {
            const symbol =
              wallet.currency.code.toLowerCase();

            const market =
              markets.find(
                (coin) =>
                  coin.symbol.toLowerCase() === symbol
              );

            const cryptoBalance =
              Number(wallet.balance);

            const usdValue =
              market
                ? cryptoBalance *
                  market.current_price
                : 0;

            const changeAmount =
              market
                ? usdValue *
                  (
                    market.price_change_percentage_24h /
                    100
                  )
                : 0;

            return (
              <Link
                key={wallet.currency.code}
                href={`/dashboard/assets/${wallet.currency.code}`}
                className="
                  block
                  rounded-2xl
                  transition
                  hover:scale-[1.01]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    bg-slate-950
                    p-5
                    transition
                    hover:bg-slate-800/70
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-slate-800
                      "
                    >
                      {market ? (
                        <img
                          src={market.image}
                          alt={wallet.currency.name}
                          className="h-10 w-10"
                        />
                      ) : (
                        <span className="text-xl text-cyan-400">
                          ◉
                        </span>
                      )}
                    </div>

                    <div>
                      <h3
                        className="
                          font-semibold
                          text-white
                        "
                      >
                        {wallet.currency.name}
                      </h3>

                      <p
                        className="
                          text-sm
                          text-slate-400
                        "
                      >
                        {cryptoBalance.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8,
                          }
                        )}{" "}
                        {wallet.currency.code}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className="
                        text-lg
                        font-bold
                        text-white
                      "
                    >
                      $
                      {usdValue.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>

                    <p
                      className={`text-sm font-medium ${
                        changeAmount >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {changeAmount >= 0 ? "+" : "-"}$

                      {Math.abs(
                        changeAmount
                      ).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{" "}
                      (
                      {market
                        ? Math.abs(
                            market.price_change_percentage_24h
                          ).toFixed(2)
                        : "0.00"}
                      %)
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}