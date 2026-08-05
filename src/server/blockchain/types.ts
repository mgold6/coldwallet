export interface WalletGenerationResult {
  address: string;
  publicKey?: string;
  privateKey?: string;
}

export interface BlockchainProvider {
  generateWallet(): Promise<WalletGenerationResult>;

  validateAddress(address: string): boolean;

  getExplorerUrl(address: string): string;
}