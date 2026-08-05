export const SupportedChains = {
  BITCOIN: "bitcoin",
  ETHEREUM: "ethereum",
  SOLANA: "solana",
  TRON: "tron",
} as const;

export type SupportedChain =
  (typeof SupportedChains)[keyof typeof SupportedChains];