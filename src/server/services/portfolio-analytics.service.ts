import prisma from "@/lib/prisma";

export class PortfolioAnalyticsService {
  async getPortfolioAnalytics(userId: string) {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId,
      },
      include: {
        wallets: {
          include: {
            currency: true,
            transactions: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

    let totalBalance = 0;

    const assetAllocation: {
      name: string;
      value: number;
    }[] = [];

    const performance: {
      date: string;
      value: number;
    }[] = [];

    for (const portfolio of portfolios) {
      for (const wallet of portfolio.wallets) {
        const balance = Number(wallet.balance);

        totalBalance += balance;

        assetAllocation.push({
          name: wallet.currency.code,
          value: balance,
        });

        performance.push({
          date: wallet.createdAt.toISOString().split("T")[0],
          value: balance,
        });
      }
    }

    return {
      totalBalance,
      assetAllocation,
      performance,
      portfolios,
    };
  }
}

export const portfolioAnalyticsService =
  new PortfolioAnalyticsService();