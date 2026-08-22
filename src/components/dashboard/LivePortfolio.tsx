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

  network?: {
    code: string;
    name: string;
    environment?: string;
  } | null;
}

interface LiveBlockchainBalanceResponse {
  success: boolean;
  data?: {
    walletId: string;
    address: string;
    currency: string;
    network: string;
    networkCode: string;
    environment: string;
    balance: string;
    balanceFormatted: string;
    source: string;
  };
  error?: string;
}

interface LivePortfolioProps {
  initialMarkets: MarketCoin[];
  wallets: Wallet[];
}

const blockchainSupportedNetworkCodes =
  new Set([
    "ETH_MAINNET",
    "ETH_SEPOLIA",
    "ETH_HOODI",

    "BSC_MAINNET",
    "BSC_TESTNET",

    "AVAX_MAINNET",
    "AVAX_FUJI",

    "XRP_MAINNET",
    "XRP_TESTNET",
    "XRP_DEVNET",

    "USDT_ETH_MAINNET",
    "USDT_ETH_SEPOLIA",

    "USDT_BSC_MAINNET",
    "USDT_BSC_TESTNET",

    "USDT_AVAX_MAINNET",
    "USDT_AVAX_FUJI",
  ]);

export default function LivePortfolio({
  initialMarkets,
  wallets,
}: LivePortfolioProps) {
  const [markets, setMarkets] =
    useState<MarketCoin[]>(initialMarkets);

  const [liveWallets, setLiveWallets] =
    useState<Wallet[]>(wallets);

  /*
   * Refresh market prices without changing
   * any stored wallet balances.
   */
  useEffect(() => {
    let cancelled = false;

    const refreshMarkets = async () => {
      try {
        const response = await fetch(
          "/api/market",
          {
            cache: "no-store",
          }
        );

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
   * Read live blockchain balances only for
   * canonical network codes supported by the
   * blockchain balance service.
   *
   * Legacy network records such as ETH or XRP
   * are intentionally skipped.
   *
   * IMPORTANT:
   * wallet.balance is never overwritten.
   */
  useEffect(() => {
    let cancelled = false;

    const refreshBlockchainBalances = async () => {
      if (!wallets.length) {
        setLiveWallets([]);
        return;
      }

      const results = await Promise.all(
        wallets.map(async (wallet) => {
          const networkCode =
            wallet.network?.code?.toUpperCase();

          if (
            !networkCode ||
            !blockchainSupportedNetworkCodes.has(
              networkCode
            )
          ) {
            return wallet;
          }

          try {
            const response = await fetch(
              `/api/wallets/${wallet.id}/blockchain-balance`,
              {
                cache: "no-store",
              }
            );

            if (!response.ok) {
              return wallet;
            }

            const data =
              (await response.json()) as LiveBlockchainBalanceResponse;

            if (
              !data.success ||
              !data.data ||
              typeof data.data.balance !== "string"
            ) {
              return wallet;
            }

            return {
              ...wallet,

              /*
               * Preserve the existing ColdWallet
               * accounting balance.
               */
              balance: wallet.balance,

              /*
               * Keep live blockchain data separate.
               */
              blockchainBalance:
                data.data.balance,
            };
          } catch (error) {
            console.error(
              `Unable to retrieve blockchain balance for wallet ${wallet.id}:`,
              error
            );

            return wallet;
          }
        })
      );

      if (!cancelled) {
        setLiveWallets(results);
      }
    };

    refreshBlockchainBalances();

    const interval = window.setInterval(
      refreshBlockchainBalances,
      60_000
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [wallets]);

  /*
   * Portfolio total continues to use the existing
   * ColdWallet wallet.balance.
   *
   * This preserves the Add Funds/internal
   * accounting model.
   */
  const totalBalance = liveWallets.reduce(
    (total, wallet) => {
      const symbol =
        wallet.currency.code.toLowerCase();

      const market = markets.find(
        (coin) =>
          coin.symbol.toLowerCase() ===
          symbol
      );

      const balance = Number(
        wallet.balance ?? 0
      );

      const marketPrice = Number(
        market?.current_price ?? 0
      );

      return (
        total +
        balance * marketPrice
      );
    },
    0
  );

  const btcMarket = markets.find(
    (coin) =>
      coin.symbol.toUpperCase() === "BTC"
  );

  const btcMarketPrice = Number(
    btcMarket?.current_price ?? 0
  );

  const btcMarketChangePercentage =
    Number(
      btcMarket?.price_change_percentage_24h ??
        0
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

            <p className="mt-2 text-sm text-slate-500">
              BTC $
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
              {btcMarketChangePercentage.toFixed(
                2
              )}
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
          wallets={liveWallets}
        />
      </div>
    </>
  );
}