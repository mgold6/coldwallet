import {
  Keypair,
  PublicKey,
} from "@solana/web3.js";

import {
  BlockchainProvider,
  WalletGenerationOptions,
  WalletGenerationResult,
} from "../types";

function getSolanaCluster(
  options?: WalletGenerationOptions
): "mainnet-beta" | "devnet" {
  const networkCode =
    options?.networkCode?.toUpperCase();

  if (networkCode === "SOL_DEVNET") {
    return "devnet";
  }

  return "mainnet-beta";
}

export class SolanaProvider
  implements BlockchainProvider
{
  async generateWallet(
    _options?: WalletGenerationOptions
  ): Promise<WalletGenerationResult> {
    const keypair = Keypair.generate();

    return {
      address:
        keypair.publicKey.toBase58(),

      publicKey:
        keypair.publicKey.toBase58(),

      privateKey: Buffer.from(
        keypair.secretKey
      ).toString("hex"),
    };
  }

  validateAddress(
    address: string,
    _options?: WalletGenerationOptions
  ): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  getExplorerUrl(
    address: string,
    options?: WalletGenerationOptions
  ): string {
    const cluster =
      getSolanaCluster(options);

    if (cluster === "devnet") {
      return `https://explorer.solana.com/address/${address}?cluster=devnet`;
    }

    return `https://explorer.solana.com/address/${address}`;
  }
}

export const solanaProvider =
  new SolanaProvider();