import { UserRole } from "@prisma/client";

import prisma from "@/lib/prisma";

import { walletRepository } from "../repositories/wallet.repository";
import { portfolioRepository } from "../repositories/portfolio.repository";

import { walletGeneratorService } from "../blockchain/wallet-generator.service";

import { auditService } from "./audit.service";

import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class WalletService {
  async assignWallet({
    currentUserRole,
    adminUserId,
    portfolioId,
    currencyId,
    networkId,
    address,
    label,
    generate = false,
  }: {
    currentUserRole: UserRole;
    adminUserId: string;
    portfolioId: string;
    currencyId: string;
    networkId?: string;
    address?: string;
    label?: string;
    generate?: boolean;
  }) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new UnauthorizedError(
        "Only administrators may assign wallet addresses."
      );
    }

    const portfolio =
      await portfolioRepository.findById(
        portfolioId
      );

    if (!portfolio) {
      throw new NotFoundError(
        "Portfolio not found."
      );
    }

    const currency =
      await prisma.currency.findUnique({
        where: {
          id: currencyId,
        },
      });

    if (!currency) {
      throw new NotFoundError(
        "Currency not found."
      );
    }

    if (networkId) {
      const network =
        await prisma.network.findFirst({
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

    let walletAddress =
      address?.trim();

    let encryptedPrivateKey:
      string | undefined;

    let publicKey:
      string | undefined;

    if (generate) {
      const generated =
        await walletGeneratorService.generate(
          currency.code
        );

      walletAddress =
        generated.address;

      encryptedPrivateKey =
        generated.encryptedPrivateKey;

      publicKey =
        generated.publicKey;
    }

    if (!walletAddress) {
      throw new ValidationError(
        "Wallet address is required."
      );
    }

    /*
     * Prevent the same blockchain address from
     * being assigned to more than one portfolio.
     *
     * This is especially important for the
     * "Existing Wallet" and manually supplied
     * address flows.
     */
    const existingAddress =
      await prisma.wallet.findFirst({
        where: {
          address: walletAddress,
        },
        include: {
          portfolio: {
            include: {
              user: true,
            },
          },
          currency: true,
          network: true,
        },
      });

    if (existingAddress) {
      if (
        existingAddress.portfolioId !==
        portfolioId
      ) {
        throw new ValidationError(
          `This wallet address is already assigned to another portfolio (${existingAddress.portfolio.user.email}). An assigned wallet address cannot be shared between portfolios.`
        );
      }

      throw new ValidationError(
        `This wallet address is already assigned to this portfolio for ${existingAddress.currency.code}.`
      );
    }

    /*
     * Prevent duplicate wallet records for the
     * same portfolio/currency/network even when
     * the address is different.
     *
     * This keeps one wallet per supported
     * currency/network assignment.
     */
    const existingPortfolioWallet =
      await prisma.wallet.findFirst({
        where: {
          portfolioId,
          currencyId,
          ...(networkId
            ? {
                networkId,
              }
            : {
                networkId: null,
              }),
        },
        include: {
          currency: true,
          network: true,
        },
      });

    if (existingPortfolioWallet) {
      const networkLabel =
        existingPortfolioWallet.network
          ? ` on ${existingPortfolioWallet.network.name}`
          : "";

      throw new ValidationError(
        `A ${existingPortfolioWallet.currency.code} wallet${networkLabel} already exists in this portfolio.`
      );
    }

    const wallet =
      await prisma.wallet.create({
        data: {
          address:
            walletAddress,

          label:
            label?.trim(),

          balance:
            0,

          availableBalance:
            0,

          blockchainBalance:
            0,

          internalBalance:
            0,

          lockedBalance:
            0,

          status:
            "ACTIVE",

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

          ...(encryptedPrivateKey
            ? {
                key: {
                  create: {
                    encryptedPrivateKey,
                    publicKey,
                  },
                },
              }
            : {}),
        },

        include: {
          portfolio: {
            include: {
              user: true,
            },
          },

          currency: true,

          network: true,
        },
      });

    await auditService.create({
      userId:
        adminUserId,

      action:
        "WALLET_ASSIGNED",

      entity:
        "Wallet",

      entityId:
        wallet.id,

      metadata:
        `Wallet ${wallet.address} assigned to ${wallet.portfolio.user.email}`,
    });

    return wallet;
  }

  async assignExistingWallet({
    walletId,
    portfolioId,
    adminUserId,
    currentUserRole,
  }: {
    walletId: string;
    portfolioId: string;
    adminUserId: string;
    currentUserRole: UserRole;
  }) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new UnauthorizedError(
        "Only administrators may assign wallet addresses."
      );
    }

    const existingWallet =
      await prisma.wallet.findUnique({
        where: {
          id: walletId,
        },
        include: {
          portfolio: {
            include: {
              user: true,
            },
          },
          currency: true,
          network: true,
        },
      });

    if (!existingWallet) {
      throw new NotFoundError(
        "Wallet not found."
      );
    }

    const portfolio =
      await portfolioRepository.findById(
        portfolioId
      );

    if (!portfolio) {
      throw new NotFoundError(
        "Portfolio not found."
      );
    }

    /*
     * IMPORTANT:
     *
     * An existing wallet must NEVER be copied
     * into another portfolio.
     *
     * The previous implementation created a
     * second Wallet record using the exact same
     * blockchain address. That caused the same
     * wallet address to appear in multiple
     * portfolios.
     */

    if (
      existingWallet.portfolioId !==
      portfolioId
    ) {
      throw new ValidationError(
        `This wallet is already assigned to another portfolio (${existingWallet.portfolio.user.email}). An assigned wallet address cannot be copied to another portfolio.`
      );
    }

    /*
     * The wallet already belongs to the selected
     * portfolio, so there is nothing to copy.
     *
     * Return the existing wallet instead of
     * creating another database record.
     */

    await auditService.create({
      userId:
        adminUserId,

      action:
        "WALLET_ALREADY_ASSIGNED",

      entity:
        "Wallet",

      entityId:
        existingWallet.id,

      metadata:
        `Wallet ${existingWallet.address ?? "without address"} is already assigned to portfolio ${portfolioId}. No duplicate wallet was created.`,
    });

    return existingWallet;
  }

  async updateWallet({
    id,
    currentUserRole,
    adminUserId,
    label,
    status,
    assignedAt,
    notes,
  }: {
    id: string;
    currentUserRole: UserRole;
    adminUserId: string;
    label?: string;
    status?: "ACTIVE" | "DISABLED";
    assignedAt?: Date | null;
    notes?: string | null;
  }) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new UnauthorizedError(
        "Only administrators may update wallets."
      );
    }

    const wallet =
      await walletRepository.findById(
        id
      );

    if (!wallet) {
      throw new NotFoundError(
        "Wallet not found."
      );
    }

    const updatedWallet =
      await walletRepository.update(
        id,
        {
          label:
            label?.trim(),

          status,

          assignedAt,

          notes:
            notes?.trim(),
        }
      );

    await auditService.create({
      userId:
        adminUserId,

      action:
        "WALLET_UPDATED",

      entity:
        "Wallet",

      entityId:
        updatedWallet.id,

      metadata:
        `Wallet ${updatedWallet.address} updated.`,
    });

    return updatedWallet;
  }
}

export const walletService =
  new WalletService();