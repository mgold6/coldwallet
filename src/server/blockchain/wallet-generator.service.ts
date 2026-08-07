import { encryptionService } from "./encryption.service";
import { blockchainProviders } from "./providers/provider-registry";

export class WalletGeneratorService {
  async generate(currencyCode: string) {
    const provider =
      blockchainProviders[
        currencyCode.toUpperCase() as keyof typeof blockchainProviders
      ];

    if (!provider) {
      throw new Error(
        `Wallet generation is not yet supported for ${currencyCode}.`
      );
    }

    const wallet = await provider.generateWallet();

    return {
      ...wallet,
      encryptedPrivateKey: wallet.privateKey
        ? encryptionService.encrypt(wallet.privateKey)
        : undefined,
    };
  }
}

export const walletGeneratorService =
  new WalletGeneratorService();