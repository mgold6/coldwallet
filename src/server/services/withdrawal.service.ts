import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { withdrawalRepository } from "@/server/repositories/withdrawal.repository";

export class WithdrawalService {
  async getWithdrawals() {
    return withdrawalRepository.list();
  }

  async getWithdrawal(id: string) {
    return withdrawalRepository.findById(id);
  }

  async approveWithdrawal(id: string) {
    return withdrawalRepository.approve(id);
  }

  async rejectWithdrawal(id: string) {
    return withdrawalRepository.reject(id);
  }

  async processWithdrawal(id: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const withdrawal = await tx.withdrawal.findUnique({
        where: {
          id,
        },
        include: {
          wallet: true,
          transaction: true,
        },
      });

      if (!withdrawal) {
        throw new Error("Withdrawal not found.");
      }

      if (withdrawal.processed) {
        throw new Error("Withdrawal has already been processed.");
      }

      if (withdrawal.wallet.balance.lt(withdrawal.amount)) {
        throw new Error("Insufficient wallet balance.");
      }

      await tx.wallet.update({
        where: {
          id: withdrawal.walletId,
        },
        data: {
          balance: {
            decrement: withdrawal.amount,
          },
        },
      });

      await tx.withdrawal.update({
        where: {
          id,
        },
        data: {
          approved: true,
          processed: true,
        },
      });

      await tx.transaction.update({
        where: {
          id: withdrawal.transactionId,
        },
        data: {
          status: "COMPLETED",
        },
      });

      return true;
    });
  }

  async getStats() {
    const [
      totalWithdrawals,
      approvedWithdrawals,
      pendingWithdrawals,
      processedWithdrawals,
    ] = await Promise.all([
      withdrawalRepository.count(),
      withdrawalRepository.approvedCount(),
      withdrawalRepository.pendingCount(),
      withdrawalRepository.processedCount(),
    ]);

    return {
      totalWithdrawals,
      approvedWithdrawals,
      pendingWithdrawals,
      processedWithdrawals,
    };
  }
}

export const withdrawalService = new WithdrawalService();