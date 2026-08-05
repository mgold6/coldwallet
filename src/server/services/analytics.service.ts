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
}

export const analyticsService = new AnalyticsService();