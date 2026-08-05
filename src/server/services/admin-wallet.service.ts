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

  async getWallets() {
    return prisma.wallet.findMany({
      include: {
        portfolio: {
          include: {
            user: true,
          },
        },
        currency: true,
        network: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getWalletById(id: string) {
    return prisma.wallet.findUnique({
      where: {
        id,
      },
      include: {
        portfolio: {
          include: {
            user: true,
          },
        },

        currency: true,

        network: true,

        deposits: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },

        withdrawals: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },

        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });
  }
}

export const adminWalletService =
  new AdminWalletService();