import { MarketCoin } from "@/types/market";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function getMarketData(): Promise<MarketCoin[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false`,
      {
        headers: {
          "x-cg-demo-api-key":
            process.env.NEXT_PUBLIC_COINGECKO_API_KEY || "",
        },
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch market data");
    }

    const data: MarketCoin[] = await response.json();

    return data;
  } catch (error) {
    console.error("CoinGecko Error:", error);
    return [];
  }
}