const COINS = [
  "bitcoin",
  "ethereum",
  "solana",
  "ripple",
  "cardano",
  "binancecoin",
  "avalanche-2",
  "dogecoin",
  "litecoin",
  "tether",
];

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export class MarketService {
  async getMarkets(): Promise<MarketCoin[]> {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

    const headers: HeadersInit = {};

    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey;
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(",")}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
      {
        headers,
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Unable to load market data.");
    }

    return response.json();
  }
}

export const marketService = new MarketService();