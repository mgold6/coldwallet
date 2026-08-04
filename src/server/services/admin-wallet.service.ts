import prisma from "@/lib/prisma";

export class AdminWalletService {
  async getAssignmentData(userId: string) {
    const [user, currencies] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          portfolios: true,
        },
      }),

      prisma.currency.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
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
      }),
    ]);

    if (!user) {
      throw new Error("User not found.");
    }

    return {
      portfolios: user.portfolios,
      currencies,
    };
  }
}

export const adminWalletService = new AdminWalletService();