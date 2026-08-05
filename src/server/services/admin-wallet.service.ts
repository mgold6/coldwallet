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
          include: {
            currency: true,
            network: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        withdrawals: {
          include: {
            currency: true,
            network: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        transactions: {
          include: {
            currency: true,
            network: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }
}

export const adminWalletService =
  new AdminWalletService();