import { Wallet, isAddress } from "ethers";

import {
  BlockchainProvider,
  WalletGenerationResult,
} from "../types";


export class EvmProvider
  implements BlockchainProvider
{

  async generateWallet(): Promise<WalletGenerationResult> {

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


  validateAddress(address: string): boolean {

    return isAddress(address);

  }


  getExplorerUrl(address: string): string {

    return `https://etherscan.io/address/${address}`;

  }

}


export const evmProvider =
  new EvmProvider();