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
    loadMarket();

    const interval = setInterval(() => {
      loadMarket();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    coins,
    loading,
    error,
    refresh: loadMarket,
  };
}