import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { userRepository } from "@/server/repositories/user.repository";

export class DashboardService {
  // ----------------------------
  // Admin Dashboard
  // ----------------------------
  async getStats() {
    const [
      totalUsers,
      totalWallets,
      totalPortfolios,
      pendingWithdrawals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.wallet.count(),
      prisma.portfolio.count(),
      prisma.withdrawal.count({
        where: {
          processed: false,
        },
      }),
    ]);

    return {
      totalUsers,
      totalWallets,
      totalPortfolios,
      pendingWithdrawals,
    };
  }

  async getUsers() {
    return userRepository.findAllWithPortfolios();
  }

  // ----------------------------
  // User Dashboard
  // ----------------------------
  async getDashboardStats(userId: string) {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId,
      },
      include: {
        wallets: true,
      },
    });

    let portfolioValue = new Prisma.Decimal(0);
    let activeWallets = 0;

    for (const portfolio of portfolios) {
      for (const wallet of portfolio.wallets) {
        portfolioValue = portfolioValue.plus(wallet.balance);

        if (wallet.status === "ACTIVE") {
          activeWallets++;
        }
      }
    }

    const depositCount = await prisma.deposit.count({
      where: {
        wallet: {
          portfolio: {
            userId,
          },
        },
      },
    });

    const withdrawalCount = await prisma.withdrawal.count({
      where: {
        wallet: {
          portfolio: {
            userId,
          },
        },
      },
    });

    return {
      portfolioValue: portfolioValue.toFixed(2),
      activeWallets,
      depositCount,
      withdrawalCount,
      todaysProfit: "0.00",
      securityScore: 98,
    };
  }
}

export const dashboardService = new DashboardService();