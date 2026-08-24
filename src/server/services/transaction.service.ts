import {
  Prisma,
  TransactionStatus,
  TransactionType,
  WithdrawalStatus,
} from "@prisma/client";

import prisma from "@/lib/prisma";

import { transactionRepository } from "../repositories/transaction.repository";

import { marketService } from "@/server/services/market.service";
import { systemSettingService } from "@/server/services/system-setting.service";

export class TransactionService {
  async getAllTransactions() {
    return transactionRepository.list();
  }

  async getTransactionById(id: string) {
    return transactionRepository.findById(id);
  }

  async getUserTransactionById(
    id: string,
    userId: string
  ) {
    return transactionRepository.findByIdForUser(
      id,
      userId
    );
  }

  async getPendingTransactions() {
    return transactionRepository.findPending();
  }

  async getWalletTransactions(
    walletId: string
  ) {
    return transactionRepository.findByWallet(
      walletId
    );
  }

  async getUserTransactions(userId: string) {
    return prisma.transaction.findMany({
      where: {
        showInHistory: true,

        wallet: {
          portfolio: {
            userId,
          },
        },
      },

      include: {
        currency: true,
        wallet: true,
        network: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 10,
    });
  }

  async createSwap({
    fromWalletId,
    toWalletId,
    amount,
  }: {
    fromWalletId: string;
    toWalletId: string;
    amount: string;
  }) {
    const fromWallet =
      await prisma.wallet.findUnique({
        where: {
          id: fromWalletId,
        },

        include: {
          currency: true,
        },
      });

    const toWallet =
      await prisma.wallet.findUnique({
        where: {
          id: toWalletId,
        },

        include: {
          currency: true,
        },
      });

    if (!fromWallet || !toWallet) {
      throw new Error(
        "Wallet not found."
      );
    }

    const swapAmount =
      new Prisma.Decimal(amount);

    if (
      swapAmount.lessThanOrEqualTo(0)
    ) {
      throw new Error(
        "Amount must be greater than zero."
      );
    }

    if (
      fromWallet.availableBalance.lessThan(
        swapAmount
      )
    ) {
      throw new Error(
        "Insufficient balance."
      );
    }

    await prisma.wallet.update({
      where: {
        id: fromWallet.id,
      },

      data: {
        availableBalance:
          fromWallet.availableBalance.minus(
            swapAmount
          ),
      },
    });

    return transactionRepository.create({
      wallet: {
        connect: {
          id: fromWallet.id,
        },
      },

      currency: {
        connect: {
          id: fromWallet.currencyId,
        },
      },

      type:
        TransactionType.INTERNAL,

      status:
        TransactionStatus.PENDING,

      amount:
        swapAmount,

      fee:
        new Prisma.Decimal(0),

      fromAddress:
        fromWallet.address,

      toAddress:
        toWallet.address,

      notes:
        `Swap ${fromWallet.currency.code} to ${toWallet.currency.code}`,
    });
  }

  /**
   * Creates a withdrawal request.
   *
   * IMPORTANT:
   *
   * 1. The user-facing amount is USD.
   * 2. The USD amount is converted to cryptocurrency.
   * 3. Market data is retrieved BEFORE the database transaction.
   * 4. The withdrawal is created as PENDING\_REVIEW.
   * 5. The user's permanent balance is NOT deducted here.
   * 6. The requested amount is reserved while Admin reviews it.
   * 7. Admin approval/decline happens elsewhere.
   * 8. Processing is responsible for the final balance deduction.
   */
  async createWithdrawal({
    walletId,
    usdAmount,
    toAddress,
  }: {
    walletId: string;
    usdAmount: string;
    toAddress: string;
  }) {
    const requestedUsd =
      new Prisma.Decimal(usdAmount);

    if (requestedUsd.lessThanOrEqualTo(0)) {
      throw new Error(
        "Amount must be greater than zero."
      );
    }

    const trimmedAddress =
      toAddress?.trim();

    if (!trimmedAddress) {
      throw new Error(
        "Recipient address is required."
      );
    }

    /*
     * Read configurable settings before the database
     * transaction. This keeps settings lookups outside
     * the interactive Prisma transaction.
     */
    const [
      withdrawalLockedMessage,
      lockedBalanceMessage,
      manualFundsWithdrawable,
      manualFundsMessage,
      insufficientBalanceMessage,
    ] = await Promise.all([
      systemSettingService.getValue(
        "message_withdrawal_locked",
        "Your balance is currently locked and cannot be withdrawn at this time. Please contact support."
      ),
      systemSettingService.getValue(
        "message_locked_balance",
        "Part of your balance is currently locked and cannot be withdrawn at this time. Please contact support."
      ),
      systemSettingService.getValue(
        "manual_funds_withdrawable",
        "false"
      ),
      systemSettingService.getValue(
        "message_manual_funds_not_withdrawable",
        "This balance is currently unavailable for withdrawal. Please contact support."
      ),
      systemSettingService.getValue(
        "withdrawal_insufficient_balance",
        "Your withdrawal request cannot be completed at this time. Please contact support."
      ),
    ]);


    /*
     * Get the wallet currency before the transaction.
     * Market lookup must never happen inside the Prisma
     * interactive transaction.
     */
    const walletForMarket =
      await prisma.wallet.findUnique({
        where: {
          id: walletId,
        },
        select: {
          id: true,
          currency: {
            select: {
              code: true,
            },
          },
          portfolio: {
            select: {
              withdrawalsEnabled: true,
              withdrawalSuccessMessage: true,
              withdrawalErrorMessage: true,
              user: {
                select: {
                  withdrawalsEnabled: true,
                  manualFundsWithdrawable: true,
                  withdrawalRestrictionMessage: true,
                  manualFundsRestrictionMessage: true,
                },
              },
            },
          },
        },
      });

    if (!walletForMarket) {
      throw new Error(
        "Wallet not found."
      );
    }

    const markets =
      await marketService.getMarkets();

    const walletMarket =
      markets.find(
        (coin) =>
          coin.symbol.toLowerCase() ===
          walletForMarket.currency.code.toLowerCase()
      );

    if (!walletMarket) {
      throw new Error(
        "Unable to get crypto price."
      );
    }

    const exchangeRate =
      new Prisma.Decimal(
        walletMarket.current_price
      );

    if (exchangeRate.lessThanOrEqualTo(0)) {
      throw new Error(
        "Unable to determine a valid crypto price."
      );
    }

    const cryptoAmount =
      requestedUsd.dividedBy(exchangeRate);

    if (cryptoAmount.lessThanOrEqualTo(0)) {
      throw new Error(
        "Withdrawal amount must be greater than zero."
      );
    }

    const globalManualFundsEnabled = [
      "true",
      "1",
      "yes",
      "on",
      "enabled",
    ].includes(
      String(manualFundsWithdrawable)
        .trim()
        .toLowerCase()
    );

    /*
     * Only short database operations occur inside this
     * transaction. No external market or settings calls
     * occur here.
     */
    return prisma.$transaction(
      async (tx) => {
        const wallet =
          await tx.wallet.findUnique({
            where: {
              id: walletId,
            },
            include: {
              currency: true,
              network: true,
              portfolio: {
                include: {
                  user: {
                    select: {
                      withdrawalsEnabled: true,
                      manualFundsWithdrawable: true,
                      withdrawalRestrictionMessage: true,
                      manualFundsRestrictionMessage: true,
                    },
                  },
                },
              },
            },
          });

        if (!wallet) {
          throw new Error(
            "Wallet not found."
          );
        }

        const userControls =
          wallet.portfolio.user;

        /*
         * Withdrawal authorization is controlled only by:
         *
         * 1. Individual user switch
         * 2. Portfolio switch
         *
         * The global/master withdrawal switch is intentionally
         * not used here.
         */
        if (!userControls.withdrawalsEnabled) {
          throw new Error(
            userControls.withdrawalRestrictionMessage?.trim() ||
              "Withdrawals are currently unavailable for your account."
          );
        }

        if (!wallet.portfolio.withdrawalsEnabled) {
          throw new Error(
            wallet.portfolio.withdrawalErrorMessage?.trim() ||
              "Withdrawals are currently unavailable for this portfolio."
          );
        }

        const manualFundsEnabled =
          userControls.manualFundsWithdrawable;

        if (wallet.withdrawalLocked) {
          throw new Error(
            withdrawalLockedMessage
          );
        }

        if (
          wallet.lockedBalance.greaterThan(0) &&
          wallet.availableBalance.lessThan(
            cryptoAmount
          )
        ) {
          throw new Error(
            lockedBalanceMessage
          );
        }

        const internalFunds =
          new Prisma.Decimal(
            wallet.internalBalance ?? 0
          );

        const blockchainFunds =
          new Prisma.Decimal(
            wallet.blockchainBalance ?? 0
          );

        let internalPortion =
          new Prisma.Decimal(0);

        let blockchainPortion =
          cryptoAmount;

        if (manualFundsEnabled) {
          internalPortion =
            Prisma.Decimal.min(
              internalFunds,
              cryptoAmount
            );

          blockchainPortion =
            cryptoAmount.minus(
              internalPortion
            );
        }

        if (
          !manualFundsEnabled &&
          cryptoAmount.greaterThan(
            blockchainFunds
          )
        ) {
          throw new Error(
            userControls.manualFundsRestrictionMessage?.trim() ||
              manualFundsMessage
          );
        }

        if (
          blockchainPortion.greaterThan(
            blockchainFunds
          )
        ) {
          throw new Error(
            insufficientBalanceMessage
          );
        }

        /*
         * Existing pending withdrawals have already reduced
         * availableBalance. Do not subtract the reserved
         * amount a second time.
         */
        if (
          wallet.availableBalance.lessThan(
            cryptoAmount
          )
        ) {
          throw new Error(
            insufficientBalanceMessage
          );
        }

        /*
         * Atomically reserve the requested amount.
         * Permanent wallet balances are not deducted here.
         */
        const reservation =
          await tx.wallet.updateMany({
            where: {
              id: wallet.id,
              availableBalance: {
                gte: cryptoAmount,
              },
            },
            data: {
              availableBalance: {
                decrement: cryptoAmount,
              },
              reservedWithdrawalBalance: {
                increment: cryptoAmount,
              },
            },
          });

        if (reservation.count !== 1) {
          throw new Error(
            insufficientBalanceMessage
          );
        }

        const transaction =
          await tx.transaction.create({
            data: {
              walletId:
                wallet.id,
              currencyId:
                wallet.currencyId,
              ...(wallet.networkId
                ? {
                    networkId:
                      wallet.networkId,
                  }
                : {}),
              type:
                TransactionType.WITHDRAWAL,
              status:
                TransactionStatus.PENDING,
              amount:
                cryptoAmount,
              usdAmount:
                requestedUsd,
              exchangeRate,
              fee:
                new Prisma.Decimal(0),
              fromAddress:
                wallet.address,
              toAddress:
                trimmedAddress,
              transactionDate:
                new Date(),
              notes:
                "Withdrawal awaiting administrator review.",
            },
          });

        const withdrawal =
          await tx.withdrawal.create({
            data: {
              transactionId:
                transaction.id,
              walletId:
                wallet.id,
              currencyId:
                wallet.currencyId,
              networkId:
                wallet.networkId,
              destinationAddress:
                trimmedAddress,
              amount:
                cryptoAmount,
              fee:
                new Prisma.Decimal(0),
              status:
                WithdrawalStatus.PENDING_REVIEW,
              approved:
                false,
              processed:
                false,
              manualFunds:
                internalPortion.greaterThan(0),
              requestedAt:
                new Date(),
              notes:
                "Awaiting administrator approval.",
            },
          });

        return {
  transaction,
  withdrawal,
  usdAmount: requestedUsd,
  cryptoAmount,
  exchangeRate,
  successMessage:
    wallet.portfolio.withdrawalSuccessMessage?.trim() ||
    "Your withdrawal request has been submitted successfully and is awaiting administrator review.",
};
      },
      {
        timeout: 15000,
        maxWait: 10000,
      }
    );
  }

  async getStats() {
    const transactions =
      await transactionRepository.list();

    return {
      total:
        transactions.length,

      pending:
        transactions.filter(
          (transaction) =>
            transaction.status ===
            TransactionStatus.PENDING
        ).length,

      processing:
        transactions.filter(
          (transaction) =>
            transaction.status ===
            TransactionStatus.PROCESSING
        ).length,

      completed:
        transactions.filter(
          (transaction) =>
            transaction.status ===
            TransactionStatus.COMPLETED
        ).length,

      failed:
        transactions.filter(
          (transaction) =>
            transaction.status ===
            TransactionStatus.FAILED
        ).length,

            cancelled:
        transactions.filter(
          (transaction) =>
            transaction.status ===
            TransactionStatus.CANCELLED
        ).length,
    };
  }
}

export const transactionService =
  new TransactionService();