export type NetworkSeed = {
  currencyCode: string;
  name: string;
  code: string;
};

export const networks: NetworkSeed[] = [
  // USD
  {
    currencyCode: "USD",
    name: "Internal",
    code: "INTERNAL",
  },

  // BTC
  {
    currencyCode: "BTC",
    name: "Bitcoin",
    code: "BTC",
  },

  // ETH
  {
    currencyCode: "ETH",
    name: "Ethereum",
    code: "ETH",
  },

  // USDT
  {
    currencyCode: "USDT",
    name: "ERC20",
    code: "ERC20",
  },
  {
    currencyCode: "USDT",
    name: "TRC20",
    code: "TRC20",
  },
  {
    currencyCode: "USDT",
    name: "BEP20",
    code: "BEP20",
  },
  {
    currencyCode: "USDT",
    name: "Solana",
    code: "SOL",
  },
  {
    currencyCode: "USDT",
    name: "Avalanche",
    code: "AVAX",
  },

  // SOL
  {
    currencyCode: "SOL",
    name: "Solana",
    code: "SOL",
  },

  // XRP
  {
    currencyCode: "XRP",
    name: "XRP Ledger",
    code: "XRP",
  },

  // ADA
  {
    currencyCode: "ADA",
    name: "Cardano",
    code: "ADA",
  },

  // BNB
  {
    currencyCode: "BNB",
    name: "BNB Smart Chain",
    code: "BSC",
  },

  // AVAX
  {
    currencyCode: "AVAX",
    name: "Avalanche",
    code: "AVAX",
  },

  // DOGE
  {
    currencyCode: "DOGE",
    name: "Dogecoin",
    code: "DOGE",
  },

  // LTC
  {
    currencyCode: "LTC",
    name: "Litecoin",
    code: "LTC",
  },
];