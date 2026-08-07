import {
  Prisma,
  TransactionType,
  TransactionStatus,
} from "@prisma/client";

import { transactionRepository } from "../repositories/transaction.repository";

import prisma from "@/lib/prisma";
import { marketService } from "@/server/services/market.service";
import { systemSettingService } from "@/server/services/system-setting.service";


export class TransactionService {


  async getAllTransactions() {

    return transactionRepository.list();

  }





  async getTransactionById(
    id: string
  ) {

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





  async getUserTransactions(
    userId: string
  ) {

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









  async createWithdrawal({

    walletId,

    amount,

    toAddress,

  }: {

    walletId: string;

    amount: string;

    toAddress: string;

  }) {



    const wallet =
      await prisma.wallet.findUnique({

        where: {
          id: walletId,
        },

        include: {

          currency: true,

          network: true,

        },

      });





    if (!wallet) {

      throw new Error(
        "Wallet not found."
      );

    }





    const sendAmount =
      new Prisma.Decimal(amount);





    if (
      sendAmount.lessThanOrEqualTo(0)
    ) {

      throw new Error(
        "Amount must be greater than zero."
      );

    }





   if (
  wallet.availableBalance.lessThan(
    sendAmount
  )
) {

  const message =
    await systemSettingService.getValue(
      "withdrawal_insufficient_balance",
      "Your withdrawal request cannot be completed at this time. Please contact support."
    );


  throw new Error(message);

}





    const markets =
      await marketService.getMarkets();





    const market =
      markets.find(
        (coin) =>
          coin.symbol.toLowerCase() ===
          wallet.currency.code.toLowerCase()
      );





    if (!market) {

      throw new Error(
        "Unable to get crypto price."
      );

    }





    const usdAmount =
      sendAmount.mul(
        new Prisma.Decimal(
          market.current_price
        )
      );






    const transaction =
      await transactionRepository.create({

        wallet: {

          connect: {
            id: wallet.id,
          },

        },


        currency: {

          connect: {
            id: wallet.currencyId,
          },

        },


        ...(wallet.networkId
          ? {

              network: {

                connect: {
                  id: wallet.networkId,
                },

              },

            }

          : {}),



        type:
          TransactionType.WITHDRAWAL,


        status:
          TransactionStatus.COMPLETED,


        amount:
          sendAmount,


        usdAmount,


        exchangeRate:
          new Prisma.Decimal(
            market.current_price
          ),



        fee:
          new Prisma.Decimal(0),



        fromAddress:
          wallet.address,



        toAddress,



        confirmedAt:
          new Date(),



        transactionDate:
          new Date(),

      });






    await prisma.wallet.update({

      where: {
        id: wallet.id,
      },


      data: {

        balance:
          wallet.balance.minus(
            sendAmount
          ),


        availableBalance:
          wallet.availableBalance.minus(
            sendAmount
          ),


        internalBalance:
          wallet.internalBalance.minus(
            sendAmount
          ),

      },

    });





    return transaction;


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
            transaction.status === "PENDING"
        ).length,


      processing:
        transactions.filter(
          (transaction) =>
            transaction.status === "PROCESSING"
        ).length,


      completed:
        transactions.filter(
          (transaction) =>
            transaction.status === "COMPLETED"
        ).length,


      failed:
        transactions.filter(
          (transaction) =>
            transaction.status === "FAILED"
        ).length,


      cancelled:
        transactions.filter(
          (transaction) =>
            transaction.status === "CANCELLED"
        ).length,

    };


  }


}





export const transactionService =
  new TransactionService();