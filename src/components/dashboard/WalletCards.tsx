interface WalletCurrency {
  code: string;
  name: string;
}

interface Wallet {
  id: string;
  availableBalance: string | number;
  currency: WalletCurrency;
}

interface Market {
  symbol: string;
  current_price: number;
}

interface WalletCardsProps {
  wallets: Wallet[];
  markets: Market[];
}

export default function WalletCards({
  wallets,
  markets,
}: WalletCardsProps) {
  if (!wallets.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Your Assets
        </h2>

        <p className="mt-4 text-slate-400">
          No wallets assigned yet.
        </p>
      </div>
    );
  }

  const icons: Record<string, string> = {
    BTC: "₿",
    ETH: "Ξ",
    SOL: "◎",
    XRP: "✕",
    ADA: "₳",
    BNB: "◆",
    AVAX: "▲",
    DOGE: "Ð",
    LTC: "Ł",
    USDT: "₮",
  };

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-white">
        Your Assets
      </h2>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
        {wallets.map((wallet) => {
          const symbol =
            wallet.currency.code.toUpperCase();

          const market = markets.find(
            (coin) =>
              coin.symbol.toUpperCase() ===
              symbol
          );

          const coinPrice =
            market?.current_price ?? 0;

          const usdValue =
            Number(wallet.availableBalance) *
            coinPrice;

          return (
            <div
              key={wallet.id}
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-800
                p-5
                transition
                hover:bg-slate-800/50
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-cyan-500/20
                    text-2xl
                    text-cyan-400
                  "
                >
                  {icons[symbol] ?? "◉"}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {wallet.currency.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {Number(
                      wallet.availableBalance
                    ).toLocaleString()}{" "}
                    {symbol}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  $
                  {usdValue.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>

                <span
                  className="
                    rounded-full
                    bg-green-500/20
                    px-3
                    py-1
                    text-xs
                    text-green-400
                  "
                >
                  Available
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}