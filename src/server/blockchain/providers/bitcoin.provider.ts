import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";

import {
  BlockchainProvider,
  WalletGenerationOptions,
  WalletGenerationResult,
} from "../types";

bitcoin.initEccLib(ecc);

const ECPair = ECPairFactory(ecc);

function getBitcoinNetwork(
  options?: WalletGenerationOptions
): bitcoin.Network {
  const networkCode =
    options?.networkCode?.toUpperCase();

  if (networkCode === "BTC_TESTNET") {
    return bitcoin.networks.testnet;
  }

  return bitcoin.networks.bitcoin;
}

export class BitcoinProvider
  implements BlockchainProvider
{
  async generateWallet(
    options?: WalletGenerationOptions
  ): Promise<WalletGenerationResult> {
    const network =
      getBitcoinNetwork(options);

    const keyPair = ECPair.makeRandom({
      network,
    });

    const payment =
      bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(
          keyPair.publicKey
        ),
        network,
      });

    if (!payment.address) {
      throw new Error(
        "Unable to generate Bitcoin wallet."
      );
    }

    return {
      address: payment.address,
      publicKey: Buffer.from(
        keyPair.publicKey
      ).toString("hex"),
      privateKey: keyPair.privateKey
        ? Buffer.from(
            keyPair.privateKey
          ).toString("hex")
        : undefined,
    };
  }

  validateAddress(
    address: string,
    options?: WalletGenerationOptions
  ): boolean {
    try {
      const network =
        getBitcoinNetwork(options);

      bitcoin.address.toOutputScript(
        address,
        network
      );

      return true;
    } catch {
      return false;
    }
  }

  getExplorerUrl(
    address: string,
    options?: WalletGenerationOptions
  ): string {
    const networkCode =
      options?.networkCode?.toUpperCase();

    if (networkCode === "BTC_TESTNET") {
      return `https://blockstream.info/testnet/address/${address}`;
    }

    return `https://www.blockchain.com/explorer/addresses/btc/${address}`;
  }
}

export const bitcoinProvider =
  new BitcoinProvider();