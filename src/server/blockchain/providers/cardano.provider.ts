import { randomBytes } from "crypto";

import {
  BlockchainProvider,
  WalletGenerationOptions,
  WalletGenerationResult,
} from "../types";

type CardanoWasmModule =
  typeof import("@emurgo/cardano-serialization-lib-nodejs");

let cardanoWasmPromise:
  | Promise<CardanoWasmModule>
  | undefined;

async function getCardanoWasm(): Promise<CardanoWasmModule> {
  if (!cardanoWasmPromise) {
    cardanoWasmPromise = import(
      "@emurgo/cardano-serialization-lib-nodejs"
    );
  }

  return cardanoWasmPromise;
}

function getCardanoNetworkId(
  options?: WalletGenerationOptions
): number {
  const networkCode =
    options?.networkCode?.toUpperCase();

  if (networkCode === "ADA_PREPROD") {
    return 0;
  }

  return 1;
}

export class CardanoProvider
  implements BlockchainProvider
{
  async generateWallet(
    options?: WalletGenerationOptions
  ): Promise<WalletGenerationResult> {
    const CardanoWasm =
      await getCardanoWasm();

    const entropy =
      randomBytes(32);

    const rootKey =
      CardanoWasm.Bip32PrivateKey
        .from_bip39_entropy(
          entropy,
          Buffer.from("")
        );

    const accountKey =
      rootKey
        .derive(1852 + 0x80000000)
        .derive(1815 + 0x80000000)
        .derive(0 + 0x80000000);

    const paymentKey =
      accountKey
        .derive(0)
        .derive(0);

    const stakeKey =
      accountKey
        .derive(2)
        .derive(0);

    const paymentCredential =
      CardanoWasm.Credential
        .from_keyhash(
          paymentKey
            .to_public()
            .to_raw_key()
            .hash()
        );

    const stakeCredential =
      CardanoWasm.Credential
        .from_keyhash(
          stakeKey
            .to_public()
            .to_raw_key()
            .hash()
        );

    const networkId =
      getCardanoNetworkId(options);

    const baseAddress =
      CardanoWasm.BaseAddress.new(
        networkId,
        paymentCredential,
        stakeCredential
      );

    const address =
      baseAddress
        .to_address()
        .to_bech32();

    return {
      address,

      publicKey:
        Buffer.from(
          paymentKey
            .to_public()
            .as_bytes()
        ).toString("hex"),

      privateKey:
        Buffer.from(
          paymentKey.as_bytes()
        ).toString("hex"),
    };
  }

  validateAddress(
    address: string,
    _options?: WalletGenerationOptions
  ): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const CardanoWasm =
        require(
          "@emurgo/cardano-serialization-lib-nodejs"
        ) as CardanoWasmModule;

      CardanoWasm.Address
        .from_bech32(address);

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

    if (networkCode === "ADA_PREPROD") {
      return `https://preprod.cardanoscan.io/address/${address}`;
    }

    return `https://cardanoscan.io/address/${address}`;
  }
}

export const cardanoProvider =
  new CardanoProvider();