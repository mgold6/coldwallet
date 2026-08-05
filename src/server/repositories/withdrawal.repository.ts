import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class WithdrawalRepository {
  async list() {
    return prisma.withdrawal.findMany({
      include: {
        wallet: {
          include: {
            portfolio: {
              include: {
                user: true,
              },
            },
          },
        },
        currency: true,
        network: true,
        transaction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.withdrawal.findUnique({
      where: {
        id,
      },
      include: {
        wallet: {
          include: {
            portfolio: {
              include: {
                user: true,
              },
            },
          },
        },
        currency: true,
        network: true,
        transaction: true,
      },
    });
  }

  async create(data: Prisma.WithdrawalCreateInput) {
    return prisma.withdrawal.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.WithdrawalUpdateInput
  ) {
    return prisma.withdrawal.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.withdrawal.delete({
      where: {
        id,
      },
    });
  }

  async count() {
    return prisma.withdrawal.count();
  }

  async approvedCount() {
    return prisma.withdrawal.count({
      where: {
        approved: true,
      },
    });
  }

  async pendingCount() {
    return prisma.withdrawal.count({
      where: {
        approved: false,
      },
    });
  }

  async processedCount() {
    return prisma.withdrawal.count({
      where: {
        processed: true,
      },
    });
  }
}

export const withdrawalRepository =
  new WithdrawalRepository();