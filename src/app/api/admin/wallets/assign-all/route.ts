import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { walletService } from "@/server/services/wallet.service";

const SUPPORTED_GENERATION = [
  "BTC",
  "ETH",
  "SOL",
  "XRP",
  "BNB",
  "AVAX",
  "USDT",
];

export async function POST(request: Request) {
  try {
    const { session, response } =
      await requireAdmin();

    if (response) {
      return response;
    }

    const body = await request.json();

    const {
      portfolioId,
    } = body;

    if (!portfolioId) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio ID required.",
        },
        {
          status: 400,
        }
      );
    }

    const [
      currencies,
      existingWallets,
    ] = await Promise.all([
      prisma.currency.findMany({
        where: {
          isActive: true,
          isCrypto: true,
        },

        include: {
          networks: {
            where: {
              isActive: true,
            },

            orderBy: {
              name: "asc",
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      }),

      prisma.wallet.findMany({
        where: {
          portfolioId,
        },

        select: {
          currencyId: true,
        },
      }),
    ]);

    const existingCurrencyIds =
      new Set(
        existingWallets.map(
          (wallet) =>
            wallet.currencyId
        )
      );

    const createdWallets = [];
    const skippedCurrencies = [];

    for (const currency of currencies) {
      if (
        !SUPPORTED_GENERATION.includes(
          currency.code
        )
      ) {
        skippedCurrencies.push({
          currency: currency.code,
          reason:
            "Wallet generation is not supported.",
        });

        continue;
      }

      if (
        existingCurrencyIds.has(
          currency.id
        )
      ) {
        skippedCurrencies.push({
          currency: currency.code,
          reason:
            "Wallet already exists.",
        });

        continue;
      }

      const network =
        currency.networks[0];

      try {
        const wallet =
          await walletService.assignWallet({
            currentUserRole:
              UserRole.ADMIN,

            adminUserId:
              session.user.id,

            portfolioId,

            currencyId:
              currency.id,

            networkId:
              network?.id,

            generate: true,
          });

        createdWallets.push(wallet);
      } catch (error) {
        console.error(
          `Failed generating ${currency.code}:`,
          error
        );

        skippedCurrencies.push({
          currency: currency.code,

          reason:
            error instanceof Error
              ? error.message
              : "Unknown error",
        });
      }
    }

    console.log(
      "ASSIGN ALL RESULT",
      {
        created:
          createdWallets.length,

        skipped:
          skippedCurrencies,

        currenciesChecked:
          currencies.map(
            (currency) =>
              currency.code
          ),

        existingWalletCount:
          existingWallets.length,
      }
    );

    return NextResponse.json({
      success: true,

      created:
        createdWallets.length,

      skipped:
        skippedCurrencies.length,

      skippedCurrencies,

      wallets:
        createdWallets,
    });
  } catch (error) {
    console.error(
      "Assign All Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}