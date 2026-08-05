import prisma from "@/lib/prisma";

export class AnalyticsService {
  async getPortfolioHistory(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        wallet: {
          portfolio: {
            userId,
          },
        },
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        amount: true,
        type: true,
        createdAt: true,
      },
    });

    let runningBalance = 0;

    return transactions.map((transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.type === "DEPOSIT") {
        runningBalance += amount;
      } else if (transaction.type === "WITHDRAWAL") {
        runningBalance -= amount;
      }

      return {
        date: transaction.createdAt.toLocaleDateString(),
        value: runningBalance,
      };
    });
  }

  async getAssetAllocation(userId: string) {
    const wallets = await prisma.wallet.findMany({
      where: {
        portfolio: {
          userId,
        },
      },
      include: {
        currency: true,
      },
    });

    const allocation = new Map<string, number>();

    for (const wallet of wallets) {
      const code = wallet.currency.code;
      const balance = Number(wallet.balance);

      allocation.set(
        code,
        (allocation.get(code) ?? 0) + balance
      );
    }

    return Array.from(allocation.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }
}

export const analyticsService = new AnalyticsService();