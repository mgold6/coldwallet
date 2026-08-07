import { randomBytes } from "crypto";

import {
  BlockchainProvider,
  WalletGenerationResult,
} from "../types";


export class CardanoProvider
  implements BlockchainProvider
{

  async generateWallet(): Promise<WalletGenerationResult> {

    const CardanoWasm =
      await import(
        "@emurgo/cardano-serialization-lib-nodejs"
      );


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



    const baseAddress =
      CardanoWasm.BaseAddress.new(
        CardanoWasm.NetworkInfo.mainnet()
          .network_id(),

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



  validateAddress(address: string): boolean {

    try {

      const CardanoWasm =
        require(
          "@emurgo/cardano-serialization-lib-nodejs"
        );


      CardanoWasm.Address
        .from_bech32(address);


      return true;


    } catch {

      return false;

    }

  }



  getExplorerUrl(address: string): string {

    return (
      `https://cardanoscan.io/address/${address}`
    );

  }

}



export const cardanoProvider =
  new CardanoProvider();