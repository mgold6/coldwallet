import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { auditService } from "@/server/services/audit.service";
import { marketService } from "@/server/services/market.service";
import { notificationService } from "@/server/services/notification.service";
import { depositNotificationService } from "@/server/services/deposit-notification.service";

export class FinancialService {
  async manualDeposit({
    walletId,
    usdAmount,
    notes,
    transactionSource = "INTERNAL",
    balanceEffect = "UPDATE",
    showInHistory = true,
    sendNotification = false,
    sendEmailNotification = false,
    txHash,
    blockchainNetwork,
    explorerUrl,
    blockchainVerified = false,
  }: {
    walletId: string;
    usdAmount: number;
    notes?: string;
    transactionSource?: string;
    balanceEffect?: string;
    showInHistory?: boolean;
    sendNotification?: boolean;
    sendEmailNotification?: boolean;
    txHash?: string;
    blockchainNetwork?: string;
    explorerUrl?: string;
    blockchainVerified?: boolean;
  }) {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: {
        currency: true,
        portfolio: true,
      },
    });

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    const markets = await marketService.getMarkets();

    const market = markets.find(
      (coin) =>
        coin.symbol.toLowerCase() ===
        wallet.currency.code.toLowerCase()
    );

    if (!market) {
      throw new Error("Unable to find crypto price.");
    }

    const cryptoAmount = new Prisma.Decimal(usdAmount).dividedBy(
      new Prisma.Decimal(market.current_price)
    );

    const completedTransaction = await prisma.$transaction(
      async (tx) => {
        const transaction = await tx.transaction.create({
          data: {
            walletId,
            currencyId: wallet.currencyId,
            networkId: wallet.networkId,
            type: "DEPOSIT",
            status: "COMPLETED",
            amount: cryptoAmount,
            usdAmount: new Prisma.Decimal(usdAmount),
            exchangeRate: new Prisma.Decimal(market.current_price),
            fee: new Prisma.Decimal(0),
            txHash,
            internalReference: `DEP-${Date.now()}`,
            transactionSource,
            showInHistory,
            blockchainNetwork,
            explorerUrl,
            blockchainVerified,
            confirmedAt: new Date(),
            transactionDate: new Date(),
            notes,
          },
        });

        const deposit = await tx.deposit.create({
          data: {
            walletId,
            currencyId: wallet.currencyId,
            networkId: wallet.networkId,
            transactionId: transaction.id,
            amount: cryptoAmount,
            usdAmount: new Prisma.Decimal(usdAmount),
            confirmed: true,
            confirmedAt: new Date(),
            creditedAt: new Date(),
            depositDate: new Date(),
            notes,
          },
        });

        if (balanceEffect !== "RECORD_ONLY") {
          const isBlockchainBacked =
            transactionSource === "TESTNET" ||
            transactionSource === "BLOCKCHAIN_IMPORT";

          await tx.wallet.update({
            where: { id: walletId },
            data: {
              balance: { increment: cryptoAmount },
              availableBalance: { increment: cryptoAmount },
              ...(isBlockchainBacked
                ? {
                    blockchainBalance: {
                      increment: cryptoAmount,
                    },
                  }
                : {}),
              ...(!isBlockchainBacked
                ? {
                    internalBalance: {
                      increment: cryptoAmount,
                    },
                  }
                : {}),
            },
          });
        }

        await auditService.create({
          action: "DEPOSIT_CREDITED",
          entity: "Deposit",
          entityId: deposit.id,
          metadata: JSON.stringify({
            usdAmount,
            cryptoAmount: cryptoAmount.toString(),
            transactionSource,
            balanceEffect,
            showInHistory,
            sendNotification,
            sendEmailNotification,
          }),
        });

        return transaction;
      },
      {
        timeout: 15000,
      }
    );

    if (
      sendNotification ||
      sendEmailNotification
    ) {
      await depositNotificationService.send(
        {
          userId: wallet.portfolio.userId,
          usdAmount,
          cryptoAmount: cryptoAmount.toString(),
          currency: wallet.currency.code,
          reference:
            completedTransaction.internalReference ??
            completedTransaction.id,
          walletAddress:
            wallet.address ?? "",
          date:
            completedTransaction.transactionDate ??
            new Date(),
        },
        {
          sendInApp: sendNotification,
          sendEmail: sendEmailNotification,
        }
      );
    }

    return completedTransaction;
  }

  async manualWithdrawal({
    walletId,
    amount,
    destinationAddress,
    notes,
    transactionSource = "INTERNAL",
    balanceEffect = "UPDATE",
    showInHistory = true,
    sendNotification = false,
    txHash,
    blockchainNetwork,
    explorerUrl,
    blockchainVerified = false,
  }: {
    walletId: string;
    amount: number;
    destinationAddress: string;
    notes?: string;
    transactionSource?: string;
    balanceEffect?: string;
    showInHistory?: boolean;
    sendNotification?: boolean;
    txHash?: string;
    blockchainNetwork?: string;
    explorerUrl?: string;
    blockchainVerified?: boolean;
  }) {
    return prisma.$transaction(
      async (tx) => {
        const wallet = await tx.wallet.findUnique({
          where: { id: walletId },
          include: {
            portfolio: true,
            currency: true,
          },
        });

        if (!wallet) {
          throw new Error("Wallet not found.");
        }

        const normalizedSource = String(transactionSource ?? "")
          .trim()
          .toUpperCase();

        const isInternalSource =
          normalizedSource === "INTERNAL" ||
          normalizedSource === "INTERNAL_LEDGER" ||
          normalizedSource === "MANUAL";

        const isBlockchainSource =
          normalizedSource === "TESTNET" ||
          normalizedSource === "TESTNET_BLOCKCHAIN" ||
          normalizedSource === "BLOCKCHAIN" ||
          normalizedSource === "BLOCKCHAIN_IMPORT";

        if (!isInternalSource && !isBlockchainSource) {
          throw new Error(
            `Unsupported transaction source: ${transactionSource ?? "UNKNOWN"}`
          );
        }

        const transaction = await tx.transaction.create({
          data: {
            walletId,
            currencyId: wallet.currencyId,
            networkId: wallet.networkId,
            type: "WITHDRAWAL",
            status: "COMPLETED",
            amount: new Prisma.Decimal(amount),
            fee: new Prisma.Decimal(0),
            txHash,
            internalReference: `WTH-${Date.now()}`,
            transactionSource,
            showInHistory,
            blockchainNetwork,
            explorerUrl,
            blockchainVerified,
            fromAddress: wallet.address,
            toAddress: destinationAddress,
            confirmedAt: new Date(),
            transactionDate: new Date(),
            notes,
          },
        });

        if (balanceEffect !== "RECORD_ONLY") {
          const withdrawalAmount = new Prisma.Decimal(amount);

          if (isInternalSource) {
            if (wallet.internalBalance.lessThan(withdrawalAmount)) {
              throw new Error("Insufficient manual balance.");
            }
          } else {
            if (wallet.blockchainBalance.lessThan(withdrawalAmount)) {
              throw new Error("Insufficient blockchain balance.");
            }
          }

          const walletUpdate: Prisma.WalletUpdateInput = {
            balance: { decrement: withdrawalAmount },
            availableBalance: { decrement: withdrawalAmount },
          };

          if (isInternalSource) {
            walletUpdate.internalBalance = {
              decrement: withdrawalAmount,
            };
          } else {
            walletUpdate.blockchainBalance = {
              decrement: withdrawalAmount,
            };
          }

          await tx.wallet.update({
            where: { id: walletId },
            data: walletUpdate,
          });
        }

        if (sendNotification) {
          await notificationService.create({
            userId: wallet.portfolio.userId,
            type: "SUCCESS",
            title: "Withdrawal Completed",
            message: `Your withdrawal of ${amount} ${wallet.currency.code} has been processed.`,
          });
        }

        return transaction;
      }
    );
  }

  async adjustBalance({
    walletId,
    amount,
    notes,
    transactionSource = "INTERNAL",
    balanceEffect = "UPDATE",
    showInHistory = true,
    sendNotification = false,
  }: {
    walletId: string;
    amount: number;
    notes?: string;
    transactionSource?: string;
    balanceEffect?: string;
    showInHistory?: boolean;
    sendNotification?: boolean;
  }) {
    if (!Number.isFinite(amount) || amount === 0) {
      throw new Error(
        "Adjustment amount must be greater than or less than zero."
      );
    }

    const normalizedSource = String(transactionSource ?? "")
      .trim()
      .toUpperCase();

    const isInternalSource =
      normalizedSource === "INTERNAL" ||
      normalizedSource === "INTERNAL_LEDGER" ||
      normalizedSource === "MANUAL";

    const isBlockchainSource =
      normalizedSource === "TESTNET" ||
      normalizedSource === "TESTNET_BLOCKCHAIN" ||
      normalizedSource === "BLOCKCHAIN" ||
      normalizedSource === "BLOCKCHAIN_IMPORT";

    if (!isInternalSource && !isBlockchainSource) {
      throw new Error(
        `Unsupported transaction source: ${transactionSource ?? "UNKNOWN"}`
      );
    }

    return prisma.$transaction(
      async (tx) => {
        const wallet = await tx.wallet.findUnique({
          where: { id: walletId },
          include: {
            portfolio: true,
            currency: true,
          },
        });

        if (!wallet) {
          throw new Error("Wallet not found.");
        }

        const markets = await marketService.getMarkets();

        const market = markets.find(
          (coin) =>
            coin.symbol.toLowerCase() ===
            wallet.currency.code.toLowerCase()
        );

        if (!market) {
          throw new Error(
            `Unable to find USD price for ${wallet.currency.code}.`
          );
        }

        const usdAmount = new Prisma.Decimal(amount);

        const adjustmentAmount = usdAmount.dividedBy(
          new Prisma.Decimal(market.current_price)
        );

        if (adjustmentAmount.isZero()) {
          throw new Error("Adjustment amount is too small.");
        }

        if (
          balanceEffect !== "RECORD_ONLY" &&
          adjustmentAmount.isNegative()
        ) {
          const amountToRemove = adjustmentAmount.abs();

          if (isInternalSource) {
            if (wallet.internalBalance.lessThan(amountToRemove)) {
              throw new Error(
                "Insufficient internal balance for this adjustment."
              );
            }
          } else {
            if (wallet.blockchainBalance.lessThan(amountToRemove)) {
              throw new Error(
                "Insufficient blockchain balance for this adjustment."
              );
            }
          }

          if (wallet.balance.lessThan(amountToRemove)) {
            throw new Error(
              "Insufficient wallet balance for this adjustment."
            );
          }

          if (wallet.availableBalance.lessThan(amountToRemove)) {
            throw new Error(
              "Insufficient available balance for this adjustment."
            );
          }
        }

        const transaction = await tx.transaction.create({
          data: {
            walletId,
            currencyId: wallet.currencyId,
            networkId: wallet.networkId,
            type: "ADJUSTMENT",
            status: "COMPLETED",
            amount: adjustmentAmount,
            usdAmount,
            exchangeRate: new Prisma.Decimal(
              market.current_price
            ),
            fee: new Prisma.Decimal(0),
            internalReference: `ADJ-${Date.now()}`,
            transactionSource,
            showInHistory,
            confirmedAt: new Date(),
            transactionDate: new Date(),
            notes,
          },
        });

        if (balanceEffect !== "RECORD_ONLY") {
          const walletUpdate: Prisma.WalletUpdateInput = {
            balance: { increment: adjustmentAmount },
            availableBalance: { increment: adjustmentAmount },
          };

          if (isInternalSource) {
            walletUpdate.internalBalance = {
              increment: adjustmentAmount,
            };
          } else {
            walletUpdate.blockchainBalance = {
              increment: adjustmentAmount,
            };
          }

          await tx.wallet.update({
            where: { id: walletId },
            data: walletUpdate,
          });
        }

        if (sendNotification) {
          await notificationService.create({
            userId: wallet.portfolio.userId,
            type: "INFO",
            title: "Balance Updated",
            message: `Your ${wallet.currency.code} balance was adjusted by $${amount}.`,
          });
        }

        await auditService.create({
          action: "BALANCE_ADJUSTED",
          entity: "Transaction",
          entityId: transaction.id,
          metadata: JSON.stringify({
            usdAmount: usdAmount.toString(),
            cryptoAmount: adjustmentAmount.toString(),
            currency: wallet.currency.code,
            exchangeRate: market.current_price,
            transactionSource,
            balanceEffect,
            showInHistory,
            sendNotification,
          }),
        });

        return transaction;
      },
      {
        timeout: 15000,
      }
    );
  }
}

export const financialService =
  new FinancialService();