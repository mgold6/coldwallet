import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class DepositRepository {
  async list() {
    return prisma.deposit.findMany({
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
    return prisma.deposit.findUnique({
      where: { id },
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

  async create(data: Prisma.DepositCreateInput) {
    return prisma.deposit.create({
      data,
    });
  }

  async update(id: string, data: Prisma.DepositUpdateInput) {
    return prisma.deposit.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.deposit.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.deposit.count();
  }

  async confirmedCount() {
    return prisma.deposit.count({
      where: {
        confirmed: true,
      },
    });
  }

  async pendingCount() {
    return prisma.deposit.count({
      where: {
        confirmed: false,
      },
    });
  }
}

export const depositRepository = new DepositRepository();