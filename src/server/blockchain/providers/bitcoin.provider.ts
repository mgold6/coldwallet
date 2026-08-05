import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";

import {
  BlockchainProvider,
  WalletGenerationResult,
} from "../types";

bitcoin.initEccLib(ecc);

const ECPair = ECPairFactory(ecc);

export class BitcoinProvider implements BlockchainProvider {
  async generateWallet(): Promise<WalletGenerationResult> {
    const network = bitcoin.networks.bitcoin;

    const keyPair = ECPair.makeRandom({
      network,
    });

    const payment = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(keyPair.publicKey),
      network,
    });

    if (!payment.address) {
      throw new Error("Unable to generate Bitcoin wallet.");
    }

    return {
      address: payment.address,
      publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
      privateKey: keyPair.privateKey
        ? Buffer.from(keyPair.privateKey).toString("hex")
        : undefined,
    };
  }

  validateAddress(address: string): boolean {
    try {
      bitcoin.address.toOutputScript(
        address,
        bitcoin.networks.bitcoin
      );
      return true;
    } catch {
      return false;
    }
  }

  getExplorerUrl(address: string): string {
    return `https://www.blockchain.com/explorer/addresses/btc/${address}`;
  }
}

export const bitcoinProvider = new BitcoinProvider();