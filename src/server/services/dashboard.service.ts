import prisma from "@/lib/prisma";
import { userRepository } from "@/server/repositories/user.repository";

export class DashboardService {
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
}

export const dashboardService = new DashboardService();