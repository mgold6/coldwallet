import { randomBytes } from "crypto";

import {
  BlockchainProvider,
  WalletGenerationResult,
} from "../types";

export class XrpProvider implements BlockchainProvider {
  async generateWallet(): Promise<WalletGenerationResult> {
    // Temporary placeholder implementation.
    // We'll replace this with the official XRP Ledger library later.
    const privateKey = randomBytes(32).toString("hex");
    const publicKey = randomBytes(33).toString("hex");

    return {
      address: `r${randomBytes(20).toString("hex")}`,
      publicKey,
      privateKey,
    };
  }

  validateAddress(address: string): boolean {
    return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address);
  }

  getExplorerUrl(address: string): string {
    return `https://livenet.xrpl.org/accounts/${address}`;
  }
}

export const xrpProvider = new XrpProvider();