import { encryptionService } from "./encryption.service";
import { blockchainProviders } from "./providers/provider-registry";
import {
  WalletGenerationOptions,
} from "./types";

export class WalletGeneratorService {
  async generate(
    currencyCode: string,
    options?: WalletGenerationOptions
  ) {
    const provider =
      blockchainProviders[
        currencyCode.toUpperCase() as keyof typeof blockchainProviders
      ];

    if (!provider) {
      throw new Error(
        `Wallet generation is not yet supported for ${currencyCode}.`
      );
    }

    const wallet =
      await provider.generateWallet(options);

    return {
      ...wallet,
      encryptedPrivateKey: wallet.privateKey
        ? encryptionService.encrypt(
            wallet.privateKey
          )
        : undefined,
    };
  }
}

export const walletGeneratorService =
  new WalletGeneratorService();