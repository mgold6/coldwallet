import {
  PrismaClient,
  Prisma,
  UserRole,
  UserStatus,
  NetworkEnvironment,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| Environment Variables
|--------------------------------------------------------------------------
*/

const ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL ?? "admin@coldwallet.io";

const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  throw new Error(
    "Missing SEED_ADMIN_PASSWORD environment variable."
  );
}

const adminPassword: string = ADMIN_PASSWORD;

/*
|--------------------------------------------------------------------------
| Seed Types
|--------------------------------------------------------------------------
*/

type CurrencySeed = Prisma.CurrencyCreateInput;

type NetworkSeed = {
  currencyCode: string;
  name: string;
  code: string;
  blockchain: string;
  environment: NetworkEnvironment;
  chainId?: string;
  nativeCurrency?: string;
  rpcUrl?: string;
  explorerUrl?: string;
  isTestnet: boolean;
};

type SettingSeed = {
  key: string;
  value: string;
  description: string;
};

/*
|--------------------------------------------------------------------------
| Currency Seed Data
|--------------------------------------------------------------------------
*/

const currencies: CurrencySeed[] = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    decimals: 2,
    isCrypto: false,
    isActive: true,
  },
  {
    code: "BTC",
    name: "Bitcoin",
    symbol: "₿",
    decimals: 8,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "ETH",
    name: "Ethereum",
    symbol: "Ξ",
    decimals: 18,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "USDT",
    name: "Tether USD",
    symbol: "₮",
    decimals: 6,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "SOL",
    name: "Solana",
    symbol: "◎",
    decimals: 9,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "XRP",
    name: "XRP",
    symbol: "XRP",
    decimals: 6,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "ADA",
    name: "Cardano",
    symbol: "ADA",
    decimals: 6,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "BNB",
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "AVAX",
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "DOGE",
    name: "Dogecoin",
    symbol: "DOGE",
    decimals: 8,
    isCrypto: true,
    isActive: true,
  },
  {
    code: "LTC",
    name: "Litecoin",
    symbol: "Ł",
    decimals: 8,
    isCrypto: true,
    isActive: true,
  },
];

/*
|--------------------------------------------------------------------------
| Network Seed Data
|--------------------------------------------------------------------------
*/

const networks: NetworkSeed[] = [
  // --------------------------------------------------------------------------
  // USD
  // --------------------------------------------------------------------------

  {
    currencyCode: "USD",
    name: "Internal",
    code: "INTERNAL",
    blockchain: "Internal",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "USD",
    isTestnet: false,
  },

  // --------------------------------------------------------------------------
  // BTC — Bitcoin
  // --------------------------------------------------------------------------

  {
    currencyCode: "BTC",
    name: "Bitcoin Mainnet",
    code: "BTC_MAINNET",
    blockchain: "Bitcoin",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "BTC",
    isTestnet: false,
  },

  {
    currencyCode: "BTC",
    name: "Bitcoin Testnet",
    code: "BTC_TESTNET",
    blockchain: "Bitcoin",
    environment: NetworkEnvironment.TESTNET,
    nativeCurrency: "BTC",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // ETH — Ethereum
  // --------------------------------------------------------------------------

  {
    currencyCode: "ETH",
    name: "Ethereum Mainnet",
    code: "ETH_MAINNET",
    blockchain: "Ethereum",
    environment: NetworkEnvironment.MAINNET,
    chainId: "1",
    nativeCurrency: "ETH",
    isTestnet: false,
  },

  {
    currencyCode: "ETH",
    name: "Ethereum Sepolia",
    code: "ETH_SEPOLIA",
    blockchain: "Ethereum",
    environment: NetworkEnvironment.TESTNET,
    chainId: "11155111",
    nativeCurrency: "ETH",
    isTestnet: true,
  },

  {
    currencyCode: "ETH",
    name: "Ethereum Hoodi",
    code: "ETH_HOODI",
    blockchain: "Ethereum",
    environment: NetworkEnvironment.TESTNET,
    chainId: "560048",
    nativeCurrency: "ETH",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // BNB — BNB Smart Chain
  // --------------------------------------------------------------------------

  {
    currencyCode: "BNB",
    name: "BNB Smart Chain Mainnet",
    code: "BSC_MAINNET",
    blockchain: "BNB Smart Chain",
    environment: NetworkEnvironment.MAINNET,
    chainId: "56",
    nativeCurrency: "BNB",
    isTestnet: false,
  },

  {
    currencyCode: "BNB",
    name: "BNB Smart Chain Testnet",
    code: "BSC_TESTNET",
    blockchain: "BNB Smart Chain",
    environment: NetworkEnvironment.TESTNET,
    chainId: "97",
    nativeCurrency: "BNB",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // SOL — Solana
  // --------------------------------------------------------------------------

  {
    currencyCode: "SOL",
    name: "Solana Mainnet",
    code: "SOL_MAINNET",
    blockchain: "Solana",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "SOL",
    isTestnet: false,
  },

  {
    currencyCode: "SOL",
    name: "Solana Devnet",
    code: "SOL_DEVNET",
    blockchain: "Solana",
    environment: NetworkEnvironment.DEVNET,
    nativeCurrency: "SOL",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // XRP — XRP Ledger
  // --------------------------------------------------------------------------

  {
    currencyCode: "XRP",
    name: "XRP Ledger Mainnet",
    code: "XRP_MAINNET",
    blockchain: "XRP Ledger",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "XRP",
    isTestnet: false,
  },

  {
    currencyCode: "XRP",
    name: "XRP Ledger Testnet",
    code: "XRP_TESTNET",
    blockchain: "XRP Ledger",
    environment: NetworkEnvironment.TESTNET,
    nativeCurrency: "XRP",
    isTestnet: true,
  },

  {
    currencyCode: "XRP",
    name: "XRP Ledger Devnet",
    code: "XRP_DEVNET",
    blockchain: "XRP Ledger",
    environment: NetworkEnvironment.DEVNET,
    nativeCurrency: "XRP",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // ADA — Cardano
  // --------------------------------------------------------------------------

  {
    currencyCode: "ADA",
    name: "Cardano Mainnet",
    code: "ADA_MAINNET",
    blockchain: "Cardano",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "ADA",
    isTestnet: false,
  },

  {
    currencyCode: "ADA",
    name: "Cardano Preprod",
    code: "ADA_PREPROD",
    blockchain: "Cardano",
    environment: NetworkEnvironment.PREPROD,
    nativeCurrency: "ADA",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // AVAX — Avalanche C-Chain
  // --------------------------------------------------------------------------

  {
    currencyCode: "AVAX",
    name: "Avalanche C-Chain Mainnet",
    code: "AVAX_MAINNET",
    blockchain: "Avalanche C-Chain",
    environment: NetworkEnvironment.MAINNET,
    chainId: "43114",
    nativeCurrency: "AVAX",
    isTestnet: false,
  },

  {
    currencyCode: "AVAX",
    name: "Avalanche Fuji Testnet",
    code: "AVAX_FUJI",
    blockchain: "Avalanche C-Chain",
    environment: NetworkEnvironment.TESTNET,
    chainId: "43113",
    nativeCurrency: "AVAX",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // DOGE — Dogecoin
  // --------------------------------------------------------------------------

  {
    currencyCode: "DOGE",
    name: "Dogecoin Mainnet",
    code: "DOGE_MAINNET",
    blockchain: "Dogecoin",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "DOGE",
    isTestnet: false,
  },

  {
    currencyCode: "DOGE",
    name: "Dogecoin Testnet",
    code: "DOGE_TESTNET",
    blockchain: "Dogecoin",
    environment: NetworkEnvironment.TESTNET,
    nativeCurrency: "DOGE",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // LTC — Litecoin
  // --------------------------------------------------------------------------

  {
    currencyCode: "LTC",
    name: "Litecoin Mainnet",
    code: "LTC_MAINNET",
    blockchain: "Litecoin",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "LTC",
    isTestnet: false,
  },

  {
    currencyCode: "LTC",
    name: "Litecoin Testnet",
    code: "LTC_TESTNET",
    blockchain: "Litecoin",
    environment: NetworkEnvironment.TESTNET,
    nativeCurrency: "LTC",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // USDT — Ethereum
  // --------------------------------------------------------------------------

  {
    currencyCode: "USDT",
    name: "USDT — Ethereum Mainnet",
    code: "USDT_ETH_MAINNET",
    blockchain: "Ethereum",
    environment: NetworkEnvironment.MAINNET,
    chainId: "1",
    nativeCurrency: "ETH",
    isTestnet: false,
  },

  {
    currencyCode: "USDT",
    name: "USDT — Ethereum Sepolia",
    code: "USDT_ETH_SEPOLIA",
    blockchain: "Ethereum",
    environment: NetworkEnvironment.TESTNET,
    chainId: "11155111",
    nativeCurrency: "ETH",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // USDT — BNB Smart Chain
  // --------------------------------------------------------------------------

  {
    currencyCode: "USDT",
    name: "USDT — BNB Smart Chain Mainnet",
    code: "USDT_BSC_MAINNET",
    blockchain: "BNB Smart Chain",
    environment: NetworkEnvironment.MAINNET,
    chainId: "56",
    nativeCurrency: "BNB",
    isTestnet: false,
  },

  {
    currencyCode: "USDT",
    name: "USDT — BNB Smart Chain Testnet",
    code: "USDT_BSC_TESTNET",
    blockchain: "BNB Smart Chain",
    environment: NetworkEnvironment.TESTNET,
    chainId: "97",
    nativeCurrency: "BNB",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // USDT — TRON
  // --------------------------------------------------------------------------

  {
    currencyCode: "USDT",
    name: "USDT — TRON Mainnet",
    code: "USDT_TRON_MAINNET",
    blockchain: "TRON",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "TRX",
    isTestnet: false,
  },

  {
    currencyCode: "USDT",
    name: "USDT — TRON Nile Testnet",
    code: "USDT_TRON_NILE",
    blockchain: "TRON",
    environment: NetworkEnvironment.TESTNET,
    nativeCurrency: "TRX",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // USDT — Solana
  // --------------------------------------------------------------------------

  {
    currencyCode: "USDT",
    name: "USDT — Solana Mainnet",
    code: "USDT_SOL_MAINNET",
    blockchain: "Solana",
    environment: NetworkEnvironment.MAINNET,
    nativeCurrency: "SOL",
    isTestnet: false,
  },

  {
    currencyCode: "USDT",
    name: "USDT — Solana Devnet",
    code: "USDT_SOL_DEVNET",
    blockchain: "Solana",
    environment: NetworkEnvironment.DEVNET,
    nativeCurrency: "SOL",
    isTestnet: true,
  },

  // --------------------------------------------------------------------------
  // USDT — Avalanche
  // --------------------------------------------------------------------------

  {
    currencyCode: "USDT",
    name: "USDT — Avalanche C-Chain Mainnet",
    code: "USDT_AVAX_MAINNET",
    blockchain: "Avalanche C-Chain",
    environment: NetworkEnvironment.MAINNET,
    chainId: "43114",
    nativeCurrency: "AVAX",
    isTestnet: false,
  },

  {
    currencyCode: "USDT",
    name: "USDT — Avalanche Fuji Testnet",
    code: "USDT_AVAX_FUJI",
    blockchain: "Avalanche C-Chain",
    environment: NetworkEnvironment.TESTNET,
    chainId: "43113",
    nativeCurrency: "AVAX",
    isTestnet: true,
  },
];

/*
|--------------------------------------------------------------------------
| System Settings
|--------------------------------------------------------------------------
*/

const settings: SettingSeed[] = [
  {
    key: "site_name",
    value: "ColdWallet",
    description: "Application name",
  },
  {
    key: "maintenance_mode",
    value: "false",
    description: "Maintenance mode",
  },
  {
    key: "registration_enabled",
    value: "true",
    description: "Allow new registrations",
  },
  {
    key: "deposits_enabled",
    value: "true",
    description: "Enable deposits",
  },
  {
    key: "withdrawals_enabled",
    value: "true",
    description: "Enable withdrawals",
  },
  {
    key: "default_currency",
    value: "USD",
    description: "Default fiat currency",
  },
  {
    key: "support_email",
    value: "support@coldwallet.io",
    description: "Support email",
  },
  {
    key: "company_name",
    value: "ColdWallet",
    description: "Company name",
  },
  {
    key: "kyc_required",
    value: "false",
    description: "Require KYC before withdrawals",
  },
];

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

async function getCurrencyId(code: string): Promise<string> {
  const currency = await prisma.currency.findUnique({
    where: {
      code,
    },
  });

  if (!currency) {
    throw new Error(`Currency ${code} not found.`);
  }

  return currency.id;
}

/*
|--------------------------------------------------------------------------
| Seed Administrator
|--------------------------------------------------------------------------
*/

async function createAdmin(): Promise<void> {
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: {
      email: ADMIN_EMAIL,
    },
    update: {
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      password: hashedPassword,
    },
    create: {
      email: ADMIN_EMAIL,
      firstName: "System",
      lastName: "Administrator",
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      isTwoFactorEnabled: false,
    },
  });

  console.log("✓ Administrator seeded");
}

/*
|--------------------------------------------------------------------------
| Seed Currencies
|--------------------------------------------------------------------------
*/

async function seedCurrencies(): Promise<void> {
  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: {
        code: currency.code,
      },
      update: {
        name: currency.name,
        symbol: currency.symbol,
        decimals: currency.decimals,
        isCrypto: currency.isCrypto,
        isActive: currency.isActive,
      },
      create: currency,
    });
  }

  console.log("✓ Currencies seeded");
}

/*
|--------------------------------------------------------------------------
| Seed Networks
|--------------------------------------------------------------------------
*/

async function seedNetworks(): Promise<void> {
  for (const network of networks) {
    const currencyId = await getCurrencyId(network.currencyCode);

    await prisma.network.upsert({
      where: {
        currencyId_code: {
          currencyId,
          code: network.code,
        },
      },
      update: {
        name: network.name,
        blockchain: network.blockchain,
        environment: network.environment,
        chainId: network.chainId,
        nativeCurrency: network.nativeCurrency,
        rpcUrl: network.rpcUrl,
        explorerUrl: network.explorerUrl,
        isTestnet: network.isTestnet,
        isActive: true,
      },
      create: {
        currencyId,
        name: network.name,
        code: network.code,
        blockchain: network.blockchain,
        environment: network.environment,
        chainId: network.chainId,
        nativeCurrency: network.nativeCurrency,
        rpcUrl: network.rpcUrl,
        explorerUrl: network.explorerUrl,
        isTestnet: network.isTestnet,
        isActive: true,
      },
    });
  }

  console.log("✓ Networks seeded");
}

/*
|--------------------------------------------------------------------------
| Seed System Settings
|--------------------------------------------------------------------------
*/

async function seedSettings(): Promise<void> {
  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: {
        key: setting.key,
      },
      update: {
        value: setting.value,
        description: setting.description,
      },
      create: setting,
    });
  }

  console.log("✓ System settings seeded");
}

/*
|--------------------------------------------------------------------------
| Main
|--------------------------------------------------------------------------
*/

async function main(): Promise<void> {
  console.log("");
  console.log("====================================");
  console.log(" ColdWallet Database Seed");
  console.log("====================================");
  console.log("");

  await createAdmin();
  await seedCurrencies();
  await seedNetworks();
  await seedSettings();

  console.log("");
  console.log("====================================");
  console.log(" Database seed completed.");
  console.log("====================================");
  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error("Database seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });