import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class FinancialService {
  async manualDeposit({
    walletId,
    amount,
    notes,
  }: {
    walletId: string;
    amount: number;
    notes?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: {
          id: walletId,
        },
      });

      if (!wallet) {
        throw new Error("Wallet not found.");
      }

      const transaction = await tx.transaction.create({
        data: {
          walletId,
          currencyId: wallet.currencyId,
          networkId: wallet.networkId,
          type: "DEPOSIT",
          status: "COMPLETED",
          amount: new Prisma.Decimal(amount),
          notes,
          confirmedAt: new Date(),
          transactionDate: new Date(),
        },
      });

      await tx.deposit.create({
        data: {
          walletId,
          currencyId: wallet.currencyId,
          networkId: wallet.networkId,
          transactionId: transaction.id,
          amount: new Prisma.Decimal(amount),
          confirmed: true,
          confirmedAt: new Date(),
          creditedAt: new Date(),
          depositDate: new Date(),
          notes,
        },
      });

      await tx.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return transaction;
    });
  }

  async manualWithdrawal({
    walletId,
    amount,
    destinationAddress,
    notes,
  }: {
    walletId: string;
    amount: number;
    destinationAddress: string;
    notes?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: {
          id: walletId,
        },
      });

      if (!wallet) {
        throw new Error("Wallet not found.");
      }

      if (Number(wallet.balance) < amount) {
        throw new Error("Insufficient balance.");
      }

      const transaction = await tx.transaction.create({
        data: {
          walletId,
          currencyId: wallet.currencyId,
          networkId: wallet.networkId,
          type: "WITHDRAWAL",
          status: "COMPLETED",
          amount: new Prisma.Decimal(amount),
          notes,
          confirmedAt: new Date(),
          transactionDate: new Date(),
        },
      });

      await tx.withdrawal.create({
        data: {
          walletId,
          currencyId: wallet.currencyId,
          networkId: wallet.networkId,
          transactionId: transaction.id,
          destinationAddress,
          amount: new Prisma.Decimal(amount),
          fee: new Prisma.Decimal(0),
          approved: true,
          processed: true,
          approvedAt: new Date(),
          processedAt: new Date(),
          completedAt: new Date(),
          requestedAt: new Date(),
          notes,
        },
      });

      await tx.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return transaction;
    });
  }

  async adjustBalance({
    walletId,
    amount,
    notes,
  }: {
    walletId: string;
    amount: number;
    notes?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: {
          id: walletId,
        },
      });

      if (!wallet) {
        throw new Error("Wallet not found.");
      }

      await tx.transaction.create({
        data: {
          walletId,
          currencyId: wallet.currencyId,
          networkId: wallet.networkId,
          type: "ADJUSTMENT",
          status: "COMPLETED",
          amount: new Prisma.Decimal(amount),
          notes,
          confirmedAt: new Date(),
          transactionDate: new Date(),
        },
      });

      await tx.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return true;
    });
  }
}

export const financialService = new FinancialService();