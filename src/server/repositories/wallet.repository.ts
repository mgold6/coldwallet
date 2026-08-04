import prisma from "@/lib/prisma";
import { Prisma, Wallet } from "@prisma/client";

export class WalletRepository {
  async findById(id: string): Promise<Wallet | null> {
    return prisma.wallet.findUnique({
      where: { id },
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
  }

  async findByAddress(address: string): Promise<Wallet | null> {
    return prisma.wallet.findUnique({
      where: {
        address,
      },
    });
  }

  async findByPortfolio(portfolioId: string): Promise<Wallet[]> {
    return prisma.wallet.findMany({
      where: {
        portfolioId,
      },
      include: {
        currency: true,
        network: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: Prisma.WalletCreateInput): Promise<Wallet> {
    return prisma.wallet.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.WalletUpdateInput
  ): Promise<Wallet> {
    return prisma.wallet.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Wallet> {
    return prisma.wallet.delete({
      where: {
        id,
      },
    });
  }

  async list(): Promise<Wallet[]> {
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
}

export const walletRepository = new WalletRepository();