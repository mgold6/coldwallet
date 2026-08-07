import {
  Keypair,
  PublicKey,
} from "@solana/web3.js";

import {
  BlockchainProvider,
  WalletGenerationResult,
} from "../types";

export class SolanaProvider implements BlockchainProvider {
  async generateWallet(): Promise<WalletGenerationResult> {
    const keypair = Keypair.generate();

    return {
      address: keypair.publicKey.toBase58(),
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(
        keypair.secretKey
      ).toString("hex"),
    };
  }

  validateAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  getExplorerUrl(address: string): string {
    return `https://explorer.solana.com/address/${address}`;
  }
}

export const solanaProvider =
  new SolanaProvider();