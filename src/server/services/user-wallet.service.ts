import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class UserWalletService {
  async getUserWallets(userId: string) {
    const wallets = await prisma.wallet.findMany({
      where: {
        portfolio: {
          userId,
        },
      },

      include: {
        currency: true,
        network: true,
        portfolio: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    return wallets.map((wallet) => ({
      ...wallet,

      balance: new Prisma.Decimal(
        wallet.balance ?? 0
      ),

      availableBalance: new Prisma.Decimal(
        wallet.availableBalance ?? 0
      ),

      blockchainBalance: new Prisma.Decimal(
        wallet.blockchainBalance ?? 0
      ),

      internalBalance: new Prisma.Decimal(
        wallet.internalBalance ?? 0
      ),

      lockedBalance: new Prisma.Decimal(
        wallet.lockedBalance ?? 0
      ),
    }));
  }

  async getPortfolioWallets(
    portfolioId: string
  ) {
    const wallets = await prisma.wallet.findMany({
      where: {
        portfolioId,
      },

      include: {
        currency: true,
        network: true,
        portfolio: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    return wallets.map((wallet) => ({
      ...wallet,

      balance: new Prisma.Decimal(
        wallet.balance ?? 0
      ),

      availableBalance: new Prisma.Decimal(
        wallet.availableBalance ?? 0
      ),

      blockchainBalance: new Prisma.Decimal(
        wallet.blockchainBalance ?? 0
      ),

      internalBalance: new Prisma.Decimal(
        wallet.internalBalance ?? 0
      ),

      lockedBalance: new Prisma.Decimal(
        wallet.lockedBalance ?? 0
      ),

      assignedById: wallet.assignedById,
    }));
  }

  async getSelectedPortfolioWallets(
    userId: string
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        selectedPortfolioId: true,
      },
    });

    if (!user?.selectedPortfolioId) {
      return [];
    }

    return this.getPortfolioWallets(
      user.selectedPortfolioId
    );
  }

  async getUserPortfolios(
    userId: string
  ) {
    return prisma.portfolio.findMany({
      where: {
        userId,
        isActive: true,
      },

      include: {
        wallets: {
          include: {
            currency: true,
            network: true,
          },
        },
      },

      orderBy: [
        {
          isDefault: "desc",
        },

        {
          createdAt: "asc",
        },
      ],
    });
  }
}

export const userWalletService =
  new UserWalletService();