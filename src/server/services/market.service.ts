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
  price_change_24h?: number;
  price_change_percentage_24h: number;
  circulating_supply?: number;
  market_cap_rank?: number;
}

export interface ChartPoint {
  time: string;
  price: number;
}

export class MarketService {
  private cachedMarkets: MarketCoin[] | null = null;
  private cachedAt = 0;

  private readonly CACHE_DURATION = 60 * 1000;

  private getHeaders(): HeadersInit {
    const apiKey = process.env.COINGECKO_API_KEY;

    const headers: HeadersInit = {
      accept: "application/json",
    };

    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey;
    }

    return headers;
  }

  async getMarkets(): Promise<MarketCoin[]> {
    const now = Date.now();

    /*
     * Return recent market data instead of making another
     * CoinGecko request on every dashboard render.
     */
    if (
      this.cachedMarkets &&
      now - this.cachedAt < this.CACHE_DURATION
    ) {
      return this.cachedMarkets;
    }

    const url =
      "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd" +
      `&ids=${COINS.join(",")}` +
      "&order=market_cap_desc" +
      "&per_page=10" +
      "&page=1" +
      "&sparkline=false" +
      "&price_change_percentage=24h";

    const response = await fetch(url, {
      headers: this.getHeaders(),
      cache: "no-store",
    });

    /*
     * CoinGecko rate limiting.
     *
     * If we already have successful market data, return it
     * instead of crashing the dashboard.
     */
    if (response.status === 429) {
      if (this.cachedMarkets) {
        console.warn(
          "CoinGecko rate limit reached. Using cached market data."
        );

        return this.cachedMarkets;
      }

      throw new Error(
        "CoinGecko rate limit reached. Please wait a moment and try again."
      );
    }

    if (!response.ok) {
      if (this.cachedMarkets) {
        console.warn(
          `CoinGecko returned ${response.status}. Using cached market data.`
        );

        return this.cachedMarkets;
      }

      throw new Error(
        `Unable to load market data. CoinGecko returned ${response.status}.`
      );
    }

    const data = (await response.json()) as MarketCoin[];

    const markets = data.map((coin) => ({
      ...coin,

      current_price: Number(
        coin.current_price ?? 0
      ),

      price_change_24h: Number(
        coin.price_change_24h ?? 0
      ),

      price_change_percentage_24h: Number(
        coin.price_change_percentage_24h ?? 0
      ),
    }));

    /*
     * Save the successful response.
     */
    this.cachedMarkets = markets;
    this.cachedAt = now;

    return markets;
  }

  async getChart(
    coinId: string
  ): Promise<ChartPoint[]> {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,
      {
        headers: this.getHeaders(),
        cache: "no-store",
      }
    );

    if (response.status === 429) {
      throw new Error(
        "CoinGecko chart rate limit reached. Please try again shortly."
      );
    }

    if (!response.ok) {
      throw new Error(
        `Unable to load chart data. CoinGecko returned ${response.status}.`
      );
    }

    const data = await response.json();

    return data.prices.map(
      (point: [number, number]) => ({
        time: new Date(
          point[0]
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),

        price: Number(point[1]),
      })
    );
  }
}

export const marketService =
  new MarketService();
