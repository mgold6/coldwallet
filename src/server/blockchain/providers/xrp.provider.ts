import {
  Wallet as XrplWallet,
  isValidAddress,
} from "xrpl";

import {
  BlockchainProvider,
  WalletGenerationOptions,
  WalletGenerationResult,
} from "../types";

function getNetworkCode(
  options?: WalletGenerationOptions
): string {
  return (
    options?.networkCode?.toUpperCase() ??
    "XRP_MAINNET"
  );
}

export class XrpProvider
  implements BlockchainProvider
{
  async generateWallet(
    _options?: WalletGenerationOptions
  ): Promise<WalletGenerationResult> {
    const wallet =
      XrplWallet.generate();

    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
    };
  }

  validateAddress(
    address: string,
    _options?: WalletGenerationOptions
  ): boolean {
    return isValidAddress(address);
  }

  getExplorerUrl(
    address: string,
    options?: WalletGenerationOptions
  ): string {
    const networkCode =
      getNetworkCode(options);

    switch (networkCode) {
      case "XRP_TESTNET":
        return `https://testnet.xrpl.org/accounts/${address}`;

      case "XRP_DEVNET":
        return `https://devnet.xrpl.org/accounts/${address}`;

      case "XRP_MAINNET":
      default:
        return `https://livenet.xrpl.org/accounts/${address}`;
    }
  }
}

export const xrpProvider =
  new XrpProvider();