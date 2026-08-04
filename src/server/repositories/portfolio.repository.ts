import prisma from "@/lib/prisma";
import { Portfolio, Prisma } from "@prisma/client";

export class PortfolioRepository {
  async findById(id: string): Promise<Portfolio | null> {
    return prisma.portfolio.findUnique({
      where: { id },
      include: {
        user: true,
        wallets: {
          include: {
            currency: true,
            network: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Portfolio[]> {
    return prisma.portfolio.findMany({
      where: { userId },
      include: {
        wallets: {
          include: {
            currency: true,
            network: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: Prisma.PortfolioCreateInput): Promise<Portfolio> {
    return prisma.portfolio.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.PortfolioUpdateInput
  ): Promise<Portfolio> {
    return prisma.portfolio.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Portfolio> {
    return prisma.portfolio.delete({
      where: { id },
    });
  }
}

export const portfolioRepository = new PortfolioRepository();