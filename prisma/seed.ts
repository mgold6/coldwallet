import {
  PrismaClient,
  Prisma,
  UserRole,
  UserStatus,
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
  // USD
  {
    currencyCode: "USD",
    name: "Internal",
    code: "INTERNAL",
  },

  // BTC
  {
    currencyCode: "BTC",
    name: "Bitcoin",
    code: "BTC",
  },

  // ETH
  {
    currencyCode: "ETH",
    name: "Ethereum",
    code: "ETH",
  },

  // USDT
  {
    currencyCode: "USDT",
    name: "ERC20",
    code: "ERC20",
  },
  {
    currencyCode: "USDT",
    name: "TRC20",
    code: "TRC20",
  },
  {
    currencyCode: "USDT",
    name: "BEP20",
    code: "BEP20",
  },
  {
    currencyCode: "USDT",
    name: "Solana",
    code: "SOL",
  },
  {
    currencyCode: "USDT",
    name: "Avalanche",
    code: "AVAX",
  },

  // SOL
  {
    currencyCode: "SOL",
    name: "Solana",
    code: "SOL",
  },

  // XRP
  {
    currencyCode: "XRP",
    name: "XRP Ledger",
    code: "XRP",
  },

  // ADA
  {
    currencyCode: "ADA",
    name: "Cardano",
    code: "ADA",
  },

  // BNB
  {
    currencyCode: "BNB",
    name: "BNB Smart Chain",
    code: "BSC",
  },

  // AVAX
  {
    currencyCode: "AVAX",
    name: "Avalanche",
    code: "AVAX",
  },

  // DOGE
  {
    currencyCode: "DOGE",
    name: "Dogecoin",
    code: "DOGE",
  },

  // LTC
  {
    currencyCode: "LTC",
    name: "Litecoin",
    code: "LTC",
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
        isActive: true,
      },
      create: {
        currencyId,
        name: network.name,
        code: network.code,
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