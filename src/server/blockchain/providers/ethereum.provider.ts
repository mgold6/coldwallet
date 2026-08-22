import { Wallet, isAddress } from "ethers";

import {
  BlockchainProvider,
  WalletGenerationOptions,
  WalletGenerationResult,
} from "../types";

export class EthereumProvider
  implements BlockchainProvider
{
  async generateWallet(
    _options?: WalletGenerationOptions
  ): Promise<WalletGenerationResult> {
    const wallet = Wallet.createRandom();

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
    return isAddress(address);
  }

  getExplorerUrl(
    address: string,
    options?: WalletGenerationOptions
  ): string {
    const networkCode =
      options?.networkCode?.toUpperCase();

    if (networkCode === "ETH_SEPOLIA") {
      return `https://sepolia.etherscan.io/address/${address}`;
    }

    if (networkCode === "ETH_HOODI") {
      return `https://hoodi.etherscan.io/address/${address}`;
    }

    return `https://etherscan.io/address/${address}`;
  }
}

export const ethereumProvider =
  new EthereumProvider();