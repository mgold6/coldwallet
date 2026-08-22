import { Wallet, isAddress } from "ethers";

import {
  BlockchainProvider,
  WalletGenerationOptions,
  WalletGenerationResult,
} from "../types";

export class EvmProvider
  implements BlockchainProvider
{
  async generateWallet(
    _options?: WalletGenerationOptions
  ): Promise<WalletGenerationResult> {
    const wallet =
      Wallet.createRandom();

    return {
      address:
        wallet.address,

      publicKey:
        wallet.publicKey,

      privateKey:
        wallet.privateKey,
    };
  }

  validateAddress(
    address: string,
    _options?: WalletGenerationOptions
  ): boolean {
    return isAddress(address);
  }

  getExplorerUrl(
    address: string,
    options?: WalletGenerationOptions
  ): string {
    const networkCode =
      options?.networkCode?.toUpperCase();

    switch (networkCode) {
      case "BSC_MAINNET":
        return `https://bscscan.com/address/${address}`;

      case "BSC_TESTNET":
        return `https://testnet.bscscan.com/address/${address}`;

      case "AVAX_MAINNET":
        return `https://snowtrace.io/address/${address}`;

      case "AVAX_FUJI":
        return `https://testnet.snowtrace.io/address/${address}`;

      default:
        return `https://etherscan.io/address/${address}`;
    }
  }
}

export const evmProvider =
  new EvmProvider();