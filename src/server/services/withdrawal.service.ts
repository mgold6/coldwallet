import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { withdrawalRepository } from "@/server/repositories/withdrawal.repository";
import { auditService } from "@/server/services/audit.service";
import { notificationService } from "@/server/services/notification.service";
import { systemSettingService } from "@/server/services/system-setting.service";

export class WithdrawalService {
  async getWithdrawals() {
    return withdrawalRepository.list();
  }

  async getWithdrawal(id: string) {
    return withdrawalRepository.findById(id);
  }

  /**
   * ADMIN APPROVES A WITHDRAWAL
   *
   * Approval changes the request from PENDING_REVIEW
   * to APPROVED.
   *
   * The reserved balance remains reserved until the
   * withdrawal is actually processed.
   */
  async approveWithdrawal(id: string) {
    const lockedMessage =
      await systemSettingService.getValue(
        "message_withdrawal_locked",
        "This wallet is currently locked for withdrawals."
      );

    const result = await prisma.$transaction(
      async (tx) => {
        const withdrawal =
          await tx.withdrawal.findUnique({
            where: {
              id,
            },
            include: {
              wallet: {
                include: {
                  portfolio: {
                    select: {
                      userId: true,
                    },
                  },
                },
              },
              transaction: true,
            },
          });

        if (!withdrawal) {
          throw new Error("Withdrawal not found.");
        }

        if (withdrawal.processed) {
          throw new Error(
            "Withdrawal has already been processed."
          );
        }

        if (withdrawal.approved) {
          throw new Error(
            "Withdrawal has already been approved."
          );
        }

        if (
          withdrawal.status !==
          "PENDING_REVIEW"
        ) {
          throw new Error(
            `Withdrawal cannot be approved from status ${withdrawal.status}.`
          );
        }

        if (withdrawal.wallet.withdrawalLocked) {
          throw new Error(lockedMessage);
        }

        const now = new Date();

        const updated =
          await tx.withdrawal.update({
            where: {
              id,
            },
            data: {
              approved: true,
              status: "APPROVED",
              approvedAt: now,
              notes:
                withdrawal.notes ??
                "Withdrawal approved by administrator.",
            },
            include: {
              wallet: true,
              transaction: true,
            },
          });

        await tx.transaction.update({
          where: {
            id: withdrawal.transactionId,
          },
          data: {
            status: "PROCESSING",
            notes:
              "Withdrawal approved by administrator.",
          },
        });

        return {
          updated,
          amount: withdrawal.amount.toString(),
          walletId: withdrawal.walletId,
          destinationAddress:
            withdrawal.destinationAddress,
        };
      },
      {
        timeout: 15000,
      }
    );

    await auditService.create({
      action: "WITHDRAWAL_APPROVED",
      entity: "Withdrawal",
      entityId: id,
      metadata: JSON.stringify({
        withdrawalId: id,
        amount: result.amount,
        walletId: result.walletId,
        destinationAddress:
          result.destinationAddress,
      }),
    });

    return result.updated;
  }

  /**
   * ADMIN DECLINES A WITHDRAWAL
   *
   * The reserved amount is returned to the user's
   * available balance.
   *
   * No actual wallet balance is deducted.
   */
  async rejectWithdrawal(
    id: string,
    reason?: string
  ) {
    const declineMessage =
      reason?.trim() ||
      (await systemSettingService.getValue(
        "message_withdrawal_declined",
        "Your withdrawal request has been declined. Please contact support."
      ));

    const result = await prisma.$transaction(
      async (tx) => {
        const withdrawal =
          await tx.withdrawal.findUnique({
            where: {
              id,
            },
            include: {
              wallet: {
                include: {
                  portfolio: {
                    select: {
                      userId: true,
                    },
                  },
                },
              },
              transaction: true,
            },
          });

        if (!withdrawal) {
          throw new Error("Withdrawal not found.");
        }

        if (withdrawal.processed) {
          throw new Error(
            "Withdrawal has already been processed."
          );
        }

        if (
          withdrawal.status ===
          "DECLINED"
        ) {
          throw new Error(
            "Withdrawal has already been declined."
          );
        }

        const reservedAmount =
          Prisma.Decimal.min(
            new Prisma.Decimal(
              withdrawal.amount
            ),
            new Prisma.Decimal(
              withdrawal.wallet
                .reservedWithdrawalBalance ??
                0
            )
          );

        /*
         * Return the reserved amount to the
         * user's available balance.
         */
        if (reservedAmount.greaterThan(0)) {
          await tx.wallet.update({
            where: {
              id: withdrawal.walletId,
            },
            data: {
              reservedWithdrawalBalance: {
                decrement: reservedAmount,
              },
              availableBalance: {
                increment: reservedAmount,
              },
            },
          });
        }

        const updated =
          await tx.withdrawal.update({
            where: {
              id,
            },
            data: {
              approved: false,
              processed: false,
              status: "DECLINED",
              notes: declineMessage,
            },
            include: {
              wallet: true,
              transaction: true,
            },
          });

        await tx.transaction.update({
          where: {
            id: withdrawal.transactionId,
          },
          data: {
            status: "CANCELLED",
            notes: declineMessage,
          },
        });

        return {
          updated,
          userId:
            withdrawal.wallet.portfolio.userId,
          reservedAmount:
            reservedAmount.toString(),
        };
      },
      {
        timeout: 15000,
      }
    );

    /*
     * Notifications and audit logging happen after
     * the financial transaction has committed. They
     * must not keep the Prisma transaction open.
     */
    await notificationService
      .create({
        userId: result.userId,
        type: "WARNING",
        title: "Withdrawal Declined",
        message: declineMessage,
      })
      .catch(() => {
        /*
         * Do not roll back the financial operation
         * merely because a notification failed.
         */
      });

    await auditService.create({
      action: "WITHDRAWAL_REJECTED",
      entity: "Withdrawal",
      entityId: id,
      metadata: JSON.stringify({
        withdrawalId: id,
        reason: declineMessage,
        releasedAmount:
          result.reservedAmount,
      }),
    });

    return result.updated;
  }

  /**
   * ADMIN PROCESSES AN APPROVED WITHDRAWAL
   *
   * This is where the actual wallet balance is
   * consumed.
   *
   * The reserved amount is released at the same time.
   */
  async processWithdrawal(id: string) {
    const result = await prisma.$transaction(
      async (tx) => {
        const withdrawal =
          await tx.withdrawal.findUnique({
            where: {
              id,
            },
            include: {
              wallet: {
                include: {
                  portfolio: {
                    select: {
                      userId: true,
                    },
                  },
                },
              },
              transaction: true,
            },
          });

        if (!withdrawal) {
          throw new Error("Withdrawal not found.");
        }

        if (withdrawal.processed) {
          throw new Error(
            "Withdrawal has already been processed."
          );
        }

        if (!withdrawal.approved) {
          throw new Error(
            "Withdrawal must be approved before it can be processed."
          );
        }

        if (
          withdrawal.status !==
          "APPROVED"
        ) {
          throw new Error(
            `Withdrawal cannot be processed from status ${withdrawal.status}.`
          );
        }

        const wallet =
          withdrawal.wallet;

        const amount =
          new Prisma.Decimal(
            withdrawal.amount
          );

        const now = new Date();

        const reserved =
          new Prisma.Decimal(
            wallet.reservedWithdrawalBalance ??
              0
          );

        if (reserved.lessThan(amount)) {
          throw new Error(
            "Reserved withdrawal balance is insufficient."
          );
        }

        /*
         * Determine how much of this withdrawal
         * is backed by internal/manual funds versus
         * blockchain-backed funds.
         */
        const internalBalance =
          new Prisma.Decimal(
            wallet.internalBalance ?? 0
          );

        const internalUsed =
      withdrawal.manualFunds
        ? Prisma.Decimal.min(
            internalBalance,
            amount
          )
        : new Prisma.Decimal(0);

        const blockchainUsed =
          amount.minus(
            internalUsed
          );

        const blockchainBalance =
          new Prisma.Decimal(
            wallet.blockchainBalance ?? 0
          );

        if (
          blockchainUsed.greaterThan(
            blockchainBalance
          )
        ) {
          throw new Error(
            "Insufficient blockchain-backed balance."
          );
        }

        /*
         * Consume the funds.
         *
         * availableBalance was already reduced when
         * the withdrawal request was created.
         *
         * Therefore it must NOT be deducted again.
         */
        await tx.wallet.update({
          where: {
            id: withdrawal.walletId,
          },
          data: {
            balance: {
              decrement: amount,
            },
            reservedWithdrawalBalance: {
              decrement: amount,
            },
            internalBalance: {
              decrement: internalUsed,
            },
            blockchainBalance: {
              decrement: blockchainUsed,
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
            status: "COMPLETED",
            approvedAt:
              withdrawal.approvedAt ??
              now,
            processedAt: now,
            completedAt: now,
          },
        });

        await tx.transaction.update({
          where: {
            id: withdrawal.transactionId,
          },
          data: {
            status: "COMPLETED",
            confirmedAt: now,
            transactionDate:
              withdrawal.transaction
                .transactionDate ??
              now,
            notes:
              "Withdrawal approved and processed by administrator.",
          },
        });

        return {
          userId:
            withdrawal.wallet.portfolio.userId,
          withdrawalId:
            withdrawal.id,
          amount:
            amount.toString(),
          internalUsed:
            internalUsed.toString(),
          blockchainUsed:
            blockchainUsed.toString(),
          destinationAddress:
            withdrawal.destinationAddress,
        };
      },
      {
        timeout: 15000,
      }
    );

    await auditService.create({
      action: "WITHDRAWAL_PROCESSED",
      entity: "Withdrawal",
      entityId: result.withdrawalId,
      metadata: JSON.stringify({
        withdrawalId:
          result.withdrawalId,
        amount: result.amount,
        internalUsed:
          result.internalUsed,
        blockchainUsed:
          result.blockchainUsed,
        destinationAddress:
          result.destinationAddress,
      }),
    });

    return true;
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

export const withdrawalService =
  new WithdrawalService();