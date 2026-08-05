import { Currency } from "@prisma/client";

import { bitcoinProvider } from "./providers/bitcoin.provider";
import { ethereumProvider } from "./providers/ethereum.provider";
import { encryptionService } from "./encryption.service";

export class WalletGeneratorService {
  async generate(currencyCode: string) {
    switch (currencyCode.toUpperCase()) {
      case "BTC": {
        const wallet = await bitcoinProvider.generateWallet();

        return {
          ...wallet,
          encryptedPrivateKey: wallet.privateKey
            ? encryptionService.encrypt(wallet.privateKey)
            : undefined,
        };
      }

      case "ETH": {
        const wallet = await ethereumProvider.generateWallet();

        return {
          ...wallet,
          encryptedPrivateKey: wallet.privateKey
            ? encryptionService.encrypt(wallet.privateKey)
            : undefined,
        };
      }

      default:
        throw new Error(
          `Wallet generation is not yet supported for ${currencyCode}.`
        );
    }
  }
}

export const walletGeneratorService =
  new WalletGeneratorService();