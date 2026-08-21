"use client";

import { useEffect, useState } from "react";

import Tokens from "@/components/dashboard/Tokens";
import QuickActions from "@/components/dashboard/QuickActions";

interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_24h?: number;
  price_change_percentage_24h: number;
  circulating_supply?: number;
  market_cap_rank?: number;
}

interface Wallet {
  id: string;
  balance: string | number;
  availableBalance?: string | number;
  blockchainBalance?: string | number;
  internalBalance?: string | number;
  lockedBalance?: string | number;
  withdrawalLocked?: boolean | number;
  reservedWithdrawalBalance?: string | number;
  currency: {
    code: string;
    name: string;
  };
}

interface LivePortfolioProps {
  initialMarkets: MarketCoin[];
  wallets: Wallet[];
}

export default function LivePortfolio({
  initialMarkets,
  wallets,
}: LivePortfolioProps) {
  const [markets, setMarkets] =
    useState<MarketCoin[]>(initialMarkets);

  useEffect(() => {
    let cancelled = false;

    const refreshMarkets = async () => {
      try {
        const response = await fetch("/api/market", {
          cache: "no-store",
        });

        if (!response.ok) {
          console.error(
            `Market request failed: ${response.status}`
          );
          return;
        }

        const data =
          (await response.json()) as MarketCoin[];

        if (
          !cancelled &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setMarkets(data);
        }
      } catch (error) {
        console.error(
          "Unable to refresh market data:",
          error
        );
      }
    };

    refreshMarkets();

    const interval = window.setInterval(
      refreshMarkets,
      30_000
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  /*
   * Total balance is always calculated from:
   *
   * wallet balance × live market price
   */
  const totalBalance = wallets.reduce(
    (total, wallet) => {
      const symbol =
        wallet.currency.code.toLowerCase();

      const market = markets.find(
        (coin) =>
          coin.symbol.toLowerCase() === symbol
      );

      const balance = Number(
        wallet.balance ?? 0
      );

      const marketPrice = Number(
        market?.current_price ?? 0
      );

      return total + balance * marketPrice;
    },
    0
  );

  /*
   * 24H performance uses the same calculation as
   * the Tokens table:
   *
   * token value × live 24H percentage
   *
   * This keeps the dashboard total synchronized
   * with the individual token rows.
   */
  const totalChange = wallets.reduce(
    (total, wallet) => {
      const symbol =
        wallet.currency.code.toLowerCase();

      const market = markets.find(
        (coin) =>
          coin.symbol.toLowerCase() === symbol
      );

      if (!market) {
        return total;
      }

      const balance = Number(
        wallet.balance ?? 0
      );

      const currentPrice = Number(
        market.current_price ?? 0
      );

      const priceChange24h = Number(
        market.price_change_24h ?? 0
      );
      const tokenChange =
        balance * priceChange24h;
      return total + tokenChange;
    },
    0
  );

  /*
   * The dashboard percentage is the aggregate 24H
   * change relative to the current portfolio value.
   *
   * For a portfolio containing only BTC at +7%,
   * the dashboard will therefore show exactly +7%.
   */
  const totalChangePercentage =
    totalBalance > 0
      ? (totalChange / totalBalance) * 100
      : 0;

  const btcMarket = markets.find(
    (coin) =>
      coin.symbol.toUpperCase() === "BTC"
  );

  const btcMarketPrice = Number(
    btcMarket?.current_price ?? 0
  );

  const btcMarketChangePercentage = Number(
    btcMarket?.price_change_percentage_24h ?? 0
  );

  return (
    <>

      <div
        className="
          rounded-3xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          to-slate-950
          p-8
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-slate-400">
              Total Balance
            </p>

            <h2
              className="
                mt-3
                text-5xl
                font-bold
                text-white
              "
            >
              $
              {totalBalance.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </h2>

            <p
              className={`mt-2 font-medium ${
                btcMarketChangePercentage >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              $
              {btcMarketPrice.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}{" "}
              (
              {btcMarketChangePercentage >= 0
                ? "+"
                : ""}
              {btcMarketChangePercentage.toFixed(2)}
              %)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <QuickActions />
      </div>

      <div className="mt-8">
        <Tokens
          markets={markets}
          wallets={wallets}
        />
      </div>
    </>
  );
}
