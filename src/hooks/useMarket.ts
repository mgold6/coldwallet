"use client";

import { useEffect, useState } from "react";
import { MarketCoin } from "@/types/market";
import { getMarketData } from "@/services/market";

export function useMarket() {
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMarket() {
    try {
      setLoading(true);

      const data = await getMarketData();

      setCoins(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load market data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchMarket() {
      try {
        const data = await getMarketData();

        if (cancelled) {
          return;
        }

        setCoins(data);
        setError("");
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(err);
        setError("Unable to load market data.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchMarket();

    const interval = setInterval(() => {
      void fetchMarket();
    }, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return {
    coins,
    loading,
    error,
    refresh: loadMarket,
  };
}