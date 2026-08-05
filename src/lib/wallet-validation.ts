export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateWalletAddress(
  currency: string,
  address: string
): ValidationResult {
  const value = address.trim();

  if (!value) {
    return {
      valid: false,
      message: "Wallet address is required.",
    };
  }

  switch (currency.toUpperCase()) {
    case "BTC":
      if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(value)) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid Bitcoin wallet address.",
      };

    case "ETH":
    case "USDT":
      if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid Ethereum-compatible address.",
      };

    case "SOL":
      if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid Solana wallet address.",
      };

    case "XRP":
      if (/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(value)) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid XRP wallet address.",
      };

    case "ADA":
      if (/^(addr1|Ae2)[a-zA-Z0-9]{20,}$/.test(value)) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid Cardano wallet address.",
      };

    case "DOGE":
      if (/^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(value)) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid Dogecoin wallet address.",
      };

    case "LTC":
      if (/^(ltc1|L|M)[a-zA-Z0-9]{25,62}$/.test(value)) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid Litecoin wallet address.",
      };

    case "BNB":
      if (
        /^bnb[a-z0-9]{38}$/.test(value) ||
        /^0x[a-fA-F0-9]{40}$/.test(value)
      ) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid BNB wallet address.",
      };

    case "AVAX":
      if (
        /^X-[a-zA-Z0-9]{30,}$/.test(value) ||
        /^0x[a-fA-F0-9]{40}$/.test(value)
      ) {
        return { valid: true };
      }

      return {
        valid: false,
        message: "Invalid Avalanche wallet address.",
      };

    default:
      return {
        valid: true,
      };
  }
}