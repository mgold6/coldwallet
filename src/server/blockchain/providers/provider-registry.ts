import { bitcoinProvider } from "./bitcoin.provider";
import { ethereumProvider } from "./ethereum.provider";
import { solanaProvider } from "./solana.provider";
import { xrpProvider } from "./xrp.provider";
import { evmProvider } from "./evm.provider";
import { cardanoProvider } from "./cardano.provider";


export const blockchainProviders = {

  BTC: bitcoinProvider,

  ETH: ethereumProvider,

  SOL: solanaProvider,

  XRP: xrpProvider,


  // EVM compatible chains
  BNB: evmProvider,

  AVAX: evmProvider,


  // Stablecoins
  // ERC20 / BEP20 USDT
  USDT: evmProvider,


  // Cardano
  ADA: cardanoProvider,


} as const;