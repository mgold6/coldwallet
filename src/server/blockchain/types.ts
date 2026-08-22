export interface WalletGenerationOptions {
  networkCode?: string;
  environment?: string;
  chainId?: string | null;
}

export interface WalletGenerationResult {
  address: string;
  publicKey?: string;
  privateKey?: string;
}

export interface BlockchainProvider {
  generateWallet(
    options?: WalletGenerationOptions
  ): Promise<WalletGenerationResult>;

  validateAddress(
    address: string,
    options?: WalletGenerationOptions
  ): boolean;

  getExplorerUrl(
    address: string,
    options?: WalletGenerationOptions
  ): string;
}