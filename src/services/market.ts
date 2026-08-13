import { MarketCoin } from "@/types/market";

export async function getMarketData(): Promise<MarketCoin[]> {
  try {
    const response = await fetch("/api/market");

    if (!response.ok) {
      throw new Error("Failed to fetch market data");
    }

    return await response.json();

  } catch (error) {
    console.error("Market Error:", error);
    return [];
  }
}