import {
  Contract,
  JsonRpcProvider,
  formatUnits,
} from "ethers";

import {
  Client as XrplClient,
  dropsToXrp,
} from "xrpl";

import prisma from "@/lib/prisma";

export type BlockchainBalanceResult = {
  walletId: string;
  address: string;
  currency: string;
  network: string;
  networkCode: string;
  environment: string;
  balance: string;
  balanceFormatted: string;
  source: "blockchain";
};

type RpcNetwork = {
  code: string;
  name: string;
  environment: string;
  rpcUrl: string;
  decimals: number;
  unit: string;
};

type BitcoinAddressStats = {
  tx_count: number;
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
};

type BitcoinAddressResponse = {
  address: string;
  chain_stats: BitcoinAddressStats;
  mempool_stats: BitcoinAddressStats;
};

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

function env(
  name: string
): string | undefined {
  const value =
    process.env[name]?.trim();

  return value ? value : undefined;
}

function getDefaultRpcUrl(
  networkCode: string
): string {
  switch (networkCode) {
    case "ETH_MAINNET":
      return (
        env(
          "ETHEREUM_MAINNET_RPC_URL"
        ) ??
        "https://ethereum-rpc.publicnode.com"
      );

    case "ETH_SEPOLIA":
      return (
        env(
          "ETHEREUM_SEPOLIA_RPC_URL"
        ) ??
        "https://ethereum-sepolia-rpc.publicnode.com"
      );

    case "ETH_HOODI":
      return (
        env(
          "ETHEREUM_HOODI_RPC_URL"
        ) ??
        "https://ethereum-hoodi-rpc.publicnode.com"
      );

    case "BSC_MAINNET":
      return (
        env(
          "BSC_MAINNET_RPC_URL"
        ) ??
        "https://bsc-dataseed.binance.org"
      );

    case "BSC_TESTNET":
      return (
        env(
          "BSC_TESTNET_RPC_URL"
        ) ??
        "https://data-seed-prebsc-1-s1.bnbchain.org:8545"
      );

    case "AVAX_MAINNET":
      return (
        env(
          "AVALANCHE_MAINNET_RPC_URL"
        ) ??
        "https://api.avax.network/ext/bc/C/rpc"
      );

    case "AVAX_FUJI":
      return (
        env(
          "AVALANCHE_FUJI_RPC_URL"
        ) ??
        "https://api.avax-test.network/ext/bc/C/rpc"
      );

    default:
      throw new Error(
        `No EVM RPC configuration is available for network ${networkCode}.`
      );
  }
}

function getXrpWebSocketUrl(
  networkCode: string
): string {
  switch (networkCode) {
    case "XRP_MAINNET":
      return (
        env(
          "XRP_MAINNET_WS_URL"
        ) ??
        "wss://xrplcluster.com"
      );

    case "XRP_TESTNET":
      return (
        env(
          "XRP_TESTNET_WS_URL"
        ) ??
        "wss://s.altnet.rippletest.net:51233"
      );

    case "XRP_DEVNET":
      return (
        env(
          "XRP_DEVNET_WS_URL"
        ) ??
        "wss://s.devnet.rippletest.net:51233"
      );

    default:
      throw new Error(
        `No XRP endpoint configuration is available for network ${networkCode}.`
      );
  }
}

function getBitcoinApiBaseUrl(
  networkCode: string
): string {
  switch (networkCode) {
    case "BTC_MAINNET":
      return (
        env(
          "BITCOIN_MAINNET_API_URL"
        ) ??
        "https://mempool.space/api"
      );

    case "BTC_TESTNET":
      return (
        env(
          "BITCOIN_TESTNET_API_URL"
        ) ??
        "https://mempool.space/testnet/api"
      );

    default:
      throw new Error(
        `No Bitcoin API configuration is available for network ${networkCode}.`
      );
  }
}

function getRpcNetwork(
  networkCode: string,
  networkName: string,
  environment: string
): RpcNetwork {
  switch (networkCode) {
    case "ETH_MAINNET":
    case "ETH_SEPOLIA":
    case "ETH_HOODI":
      return {
        code: networkCode,
        name: networkName,
        environment,
        rpcUrl:
          getDefaultRpcUrl(
            networkCode
          ),
        decimals: 18,
        unit: "ETH",
      };

    case "BSC_MAINNET":
    case "BSC_TESTNET":
      return {
        code: networkCode,
        name: networkName,
        environment,
        rpcUrl:
          getDefaultRpcUrl(
            networkCode
          ),
        decimals: 18,
        unit: "BNB",
      };

    case "AVAX_MAINNET":
    case "AVAX_FUJI":
      return {
        code: networkCode,
        name: networkName,
        environment,
        rpcUrl:
          getDefaultRpcUrl(
            networkCode
          ),
        decimals: 18,
        unit: "AVAX",
      };

    default:
      throw new Error(
        `Blockchain balance lookup is not yet implemented for network ${networkCode}.`
      );
  }
}

function isBitcoinNetwork(
  networkCode: string
): boolean {
  return (
    networkCode === "BTC_MAINNET" ||
    networkCode === "BTC_TESTNET"
  );
}

function isEvmUsdtNetwork(
  networkCode: string
): boolean {
  return new Set([
    "USDT_ETH_MAINNET",
    "USDT_ETH_SEPOLIA",
    "USDT_BSC_MAINNET",
    "USDT_BSC_TESTNET",
    "USDT_AVAX_MAINNET",
    "USDT_AVAX_FUJI",
  ]).has(networkCode);
}

async function getBitcoinBalance(
  address: string,
  networkCode: string
): Promise<string> {
  const baseUrl =
    getBitcoinApiBaseUrl(
      networkCode
    );

  const url =
    `${baseUrl}/address/${encodeURIComponent(
      address
    )}`;

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      15_000
    );

  try {
    const response =
      await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      });

    if (!response.ok) {
      throw new Error(
        `Bitcoin API returned HTTP ${response.status}.`
      );
    }

    const data =
      (await response.json()) as BitcoinAddressResponse;

    if (
      !data ||
      !data.chain_stats ||
      !data.mempool_stats
    ) {
      throw new Error(
        "Bitcoin API returned an invalid address response."
      );
    }

    const confirmedBalance =
      data.chain_stats.funded_txo_sum -
      data.chain_stats.spent_txo_sum;

    const mempoolBalance =
      data.mempool_stats.funded_txo_sum -
      data.mempool_stats.spent_txo_sum;

    const satoshis =
      confirmedBalance +
      mempoolBalance;

    return formatUnits(
      BigInt(satoshis),
      8
    );
  } catch (error) {
    if (
      error instanceof
        DOMException &&
      error.name ===
        "AbortError"
    ) {
      throw new Error(
        "Bitcoin balance lookup timed out."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function getEvmNativeBalance(
  address: string,
  network: RpcNetwork
): Promise<string> {
  const provider =
    new JsonRpcProvider(
      network.rpcUrl
    );

  const balance =
    await provider.getBalance(
      address
    );

  return formatUnits(
    balance,
    network.decimals
  );
}

async function getEvmTokenBalance(
  address: string,
  networkCode: string,
  currencyId: string,
  networkId: string
): Promise<{
  balance: string;
  unit: string;
}> {
  const contract =
    await prisma.tokenContract.findUnique({
      where: {
        currencyId_networkId: {
          currencyId,
          networkId,
        },
      },
      select: {
        contractAddress: true,
        symbol: true,
        decimals: true,
      },
    });

  if (!contract) {
    throw new Error(
      `No token contract is configured for ${networkCode}.`
    );
  }

  const decimals =
    contract.decimals ?? 18;

  const rpcUrl =
    getDefaultRpcUrl(
      getUnderlyingEvmNetworkCode(
        networkCode
      )
    );

  const provider =
    new JsonRpcProvider(
      rpcUrl
    );

  const token =
    new Contract(
      contract.contractAddress,
      ERC20_ABI,
      provider
    );

  const rawBalance =
    await token.balanceOf(address);

  return {
    balance: formatUnits(
      rawBalance,
      decimals
    ),
    unit:
      contract.symbol ?? "USDT",
  };
}

function getUnderlyingEvmNetworkCode(
  tokenNetworkCode: string
): string {
  switch (tokenNetworkCode) {
    case "USDT_ETH_MAINNET":
      return "ETH_MAINNET";

    case "USDT_ETH_SEPOLIA":
      return "ETH_SEPOLIA";

    case "USDT_BSC_MAINNET":
      return "BSC_MAINNET";

    case "USDT_BSC_TESTNET":
      return "BSC_TESTNET";

    case "USDT_AVAX_MAINNET":
      return "AVAX_MAINNET";

    case "USDT_AVAX_FUJI":
      return "AVAX_FUJI";

    default:
      throw new Error(
        `No EVM network mapping exists for token network ${tokenNetworkCode}.`
      );
  }
}

async function getXrpBalance(
  address: string,
  networkCode: string
): Promise<string> {
  const server =
    getXrpWebSocketUrl(
      networkCode
    );

  const client =
    new XrplClient(server);

  try {
    await client.connect();

    const response =
      await client.request({
        command: "account_info",
        account: address,
        ledger_index: "validated",
      });

    const drops =
      response.result
        .account_data.Balance;

    return String(
      dropsToXrp(drops)
    );
  } finally {
    await client.disconnect();
  }
}

async function getNetworkBalance(
  address: string,
  networkCode: string,
  networkName: string,
  environment: string,
  currencyId: string,
  networkId: string
): Promise<{
  balance: string;
  unit: string;
}> {
  if (
    isBitcoinNetwork(
      networkCode
    )
  ) {
    const balance =
      await getBitcoinBalance(
        address,
        networkCode
      );

    return {
      balance,
      unit: "BTC",
    };
  }

  if (
    networkCode ===
      "XRP_MAINNET" ||
    networkCode ===
      "XRP_TESTNET" ||
    networkCode ===
      "XRP_DEVNET"
  ) {
    const balance =
      await getXrpBalance(
        address,
        networkCode
      );

    return {
      balance,
      unit: "XRP",
    };
  }

  if (
    isEvmUsdtNetwork(
      networkCode
    )
  ) {
    return getEvmTokenBalance(
      address,
      networkCode,
      currencyId,
      networkId
    );
  }

  const network =
    getRpcNetwork(
      networkCode,
      networkName,
      environment
    );

  const balance =
    await getEvmNativeBalance(
      address,
      network
    );

  return {
    balance,
    unit: network.unit,
  };
}

export async function getWalletBlockchainBalance(
  walletId: string
): Promise<BlockchainBalanceResult> {
  const wallet =
    await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
      include: {
        currency: true,
        network: true,
      },
    });

  if (!wallet) {
    throw new Error(
      `Wallet ${walletId} was not found.`
    );
  }

  if (!wallet.address) {
    throw new Error(
      "Wallet does not have a blockchain address."
    );
  }

  if (!wallet.network) {
    throw new Error(
      "Wallet does not have a network assigned."
    );
  }

  const networkCode =
    wallet.network.code.toUpperCase();

  const networkEnvironment =
    wallet.network.environment;

  const currencyCode =
    wallet.currency.code.toUpperCase();

  /*
   * Legacy network records exist in the database.
   *
   * They are intentionally not guessed or silently
   * remapped. Existing wallets should be assigned to
   * canonical network records before requesting a
   * blockchain balance.
   */
  if (
    networkCode === "ETH" ||
    networkCode === "BTC" ||
    networkCode === "SOL" ||
    networkCode === "BSC" ||
    networkCode === "AVAX" ||
    networkCode === "LTC" ||
    networkCode === "DOGE" ||
    networkCode === "XRP" ||
    networkCode === "ADA" ||
    networkCode === "ERC20" ||
    networkCode === "TRC20"
  ) {
    throw new Error(
      `Wallet uses legacy network code ${networkCode}. Assign the wallet to a canonical network before requesting a blockchain balance.`
    );
  }

  /*
   * USDT on Solana and TRON are intentionally not
   * included in this EVM implementation. Those require
   * native Solana/TRON token providers.
   */
  if (
    currencyCode === "USDT" &&
    !isEvmUsdtNetwork(
      networkCode
    ) &&
    (
      networkCode.startsWith(
        "USDT_SOL_"
      ) ||
      networkCode.startsWith(
        "USDT_TRON_"
      )
    )
  ) {
    throw new Error(
      `USDT blockchain balance lookup is not yet implemented for network ${networkCode}.`
    );
  }

  const result =
    await getNetworkBalance(
      wallet.address,
      networkCode,
      wallet.network.name,
      networkEnvironment,
      wallet.currency.id,
      wallet.network.id
    );

  return {
    walletId: wallet.id,
    address: wallet.address,
    currency:
      wallet.currency.code,
    network:
      wallet.network.name,
    networkCode,
    environment:
      networkEnvironment,
    balance:
      result.balance,
    balanceFormatted:
      `${result.balance} ${result.unit}`,
    source: "blockchain",
  };
}