import { UserRole } from "@prisma/client";

import prisma from "@/lib/prisma";

import { walletRepository } from "../repositories/wallet.repository";
import { portfolioRepository } from "../repositories/portfolio.repository";

import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class WalletService {
  async assignWallet({
    currentUserRole,
    portfolioId,
    currencyId,
    networkId,
    address,
    label,
  }: {
    currentUserRole: UserRole;

    portfolioId: string;

    currencyId: string;

    networkId?: string;

    address: string;

    label?: string;
  }) {
    // Only administrators may assign wallets.
    if (currentUserRole !== UserRole.ADMIN) {
      throw new UnauthorizedError(
        "Only administrators may assign wallet addresses."
      );
    }

    const portfolio =
      await portfolioRepository.findById(portfolioId);

    if (!portfolio) {
      throw new NotFoundError("Portfolio not found.");
    }

    const currency = await prisma.currency.findUnique({
      where: {
        id: currencyId,
      },
    });

    if (!currency) {
      throw new NotFoundError("Currency not found.");
    }

    if (networkId) {
      const network = await prisma.network.findFirst({
        where: {
          id: networkId,
          currencyId,
        },
      });

      if (!network) {
        throw new ValidationError(
          "Selected network does not belong to the selected currency."
        );
      }
    }

    const existingWallet =
      await walletRepository.findByAddress(address);

    if (existingWallet) {
      throw new ValidationError(
        "Wallet address already exists."
      );
    }

    const wallet = await walletRepository.create({
  address: address.trim(),
  label: label?.trim(),

  balance: 0,

  status: "ACTIVE",

  portfolio: {
    connect: {
      id: portfolioId,
    },
  },

  currency: {
    connect: {
      id: currencyId,
    },
  },

  ...(networkId
    ? {
        network: {
          connect: {
            id: networkId,
          },
        },
      }
    : {}),
});

return wallet;
  }
}

export const walletService = new WalletService();