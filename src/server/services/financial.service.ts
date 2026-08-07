import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { auditService } from "@/server/services/audit.service";
import { marketService } from "@/server/services/market.service";
import { notificationService } from "@/server/services/notification.service";



export class FinancialService {



  async manualDeposit({

    walletId,

    usdAmount,

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

    usdAmount: number;

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



    const wallet =
      await prisma.wallet.findUnique({

        where: {
          id: walletId,
        },

        include: {

          currency: true,

          portfolio: true,

        },

      });



    if (!wallet) {

      throw new Error(
        "Wallet not found."
      );

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
        "Unable to find crypto price."
      );

    }





    const cryptoAmount =
      new Prisma.Decimal(usdAmount)
        .dividedBy(
          new Prisma.Decimal(
            market.current_price
          )
        );







    return prisma.$transaction(async (tx) => {



      const transaction =
        await tx.transaction.create({

          data: {


            walletId,


            currencyId:
              wallet.currencyId,


            networkId:
              wallet.networkId,



            type:
              "DEPOSIT",



            status:
              "COMPLETED",



            amount:
              cryptoAmount,



            usdAmount:
              new Prisma.Decimal(
                usdAmount
              ),



            exchangeRate:
              new Prisma.Decimal(
                market.current_price
              ),



            fee:
              new Prisma.Decimal(0),



            txHash,



            internalReference:
              `DEP-${Date.now()}`,



            transactionSource,



            showInHistory,



            blockchainNetwork,



            explorerUrl,



            blockchainVerified,



            confirmedAt:
              new Date(),



            transactionDate:
              new Date(),



            notes,


          },

        });







      const deposit =
        await tx.deposit.create({

          data: {


            walletId,


            currencyId:
              wallet.currencyId,


            networkId:
              wallet.networkId,



            transactionId:
              transaction.id,



            amount:
              cryptoAmount,



            usdAmount:
              new Prisma.Decimal(
                usdAmount
              ),



            confirmed:
              true,



            confirmedAt:
              new Date(),



            creditedAt:
              new Date(),



            depositDate:
              new Date(),



            notes,


          },

        });








      if (balanceEffect !== "RECORD_ONLY") {


        await tx.wallet.update({

          where: {

            id: walletId,

          },


          data: {


            balance: {

              increment:
                cryptoAmount,

            },


            availableBalance: {

              increment:
                cryptoAmount,

            },


            blockchainBalance: {

              increment:
                cryptoAmount,

            },


            internalBalance: {

              increment:
                cryptoAmount,

            },


          },

        });


      }







      if (sendNotification) {


        await notificationService.create({

          userId:
            wallet.portfolio.userId,


          type:
            "SUCCESS",


          title:
            "Deposit Received",


          message:
            `Your wallet received a deposit of $${usdAmount}.`,


        });


      }







      await auditService.create({

        action:
          "DEPOSIT_CREDITED",


        entity:
          "Deposit",


        entityId:
          deposit.id,


        metadata:
          JSON.stringify({

            usdAmount,

            cryptoAmount:
              cryptoAmount.toString(),

            transactionSource,

            balanceEffect,

            showInHistory,

            sendNotification,

          }),


      });






      return transaction;



    }, {

      timeout: 15000,

    });


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



    return prisma.$transaction(async (tx) => {



      const wallet =
        await tx.wallet.findUnique({

          where: {

            id: walletId,

          },

          include: {

            portfolio: true,

            currency: true,

          },

        });





      if (!wallet) {

        throw new Error(
          "Wallet not found."
        );

      }





      if (

        Number(wallet.balance) < amount &&

        balanceEffect !== "RECORD_ONLY"

      ) {

        throw new Error(
          "Insufficient balance."
        );

      }







      const transaction =
        await tx.transaction.create({

          data: {


            walletId,


            currencyId:
              wallet.currencyId,


            networkId:
              wallet.networkId,



            type:
              "WITHDRAWAL",



            status:
              "COMPLETED",



            amount:
              new Prisma.Decimal(amount),



            fee:
              new Prisma.Decimal(0),



            txHash,



            internalReference:
              `WTH-${Date.now()}`,



            transactionSource,



            showInHistory,



            blockchainNetwork,



            explorerUrl,



            blockchainVerified,



            fromAddress:
              wallet.address,



            toAddress:
              destinationAddress,



            confirmedAt:
              new Date(),



            transactionDate:
              new Date(),



            notes,


          },

        });







      if (balanceEffect !== "RECORD_ONLY") {


        await tx.wallet.update({

          where: {

            id: walletId,

          },


          data: {


            balance: {

              decrement:
                amount,

            },


            availableBalance: {

              decrement:
                amount,

            },


          },

        });


      }







      if (sendNotification) {


        await notificationService.create({

          userId:
            wallet.portfolio.userId,


          type:
            "SUCCESS",


          title:
            "Withdrawal Completed",


          message:
            `Your withdrawal of ${amount} ${wallet.currency.code} has been processed.`,


        });


      }







      return transaction;



    });


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



    return prisma.$transaction(async (tx) => {



      const wallet =
        await tx.wallet.findUnique({

          where: {

            id: walletId,

          },

          include: {

            portfolio: true,

          },

        });





      if (!wallet) {

        throw new Error(
          "Wallet not found."
        );

      }







      const transaction =
        await tx.transaction.create({

          data: {


            walletId,


            currencyId:
              wallet.currencyId,


            networkId:
              wallet.networkId,



            type:
              "ADJUSTMENT",



            status:
              "COMPLETED",



            amount:
              new Prisma.Decimal(amount),



            fee:
              new Prisma.Decimal(0),



            internalReference:
              `ADJ-${Date.now()}`,



            transactionSource,



            showInHistory,



            confirmedAt:
              new Date(),



            transactionDate:
              new Date(),



            notes,


          },

        });







      if (balanceEffect !== "RECORD_ONLY") {


        await tx.wallet.update({

          where: {

            id: walletId,

          },


          data: {


            balance: {

              increment:
                amount,

            },


            availableBalance: {

              increment:
                amount,

            },


          },

        });


      }







      if (sendNotification) {


        await notificationService.create({

          userId:
            wallet.portfolio.userId,


          type:
            "INFO",


          title:
            "Balance Updated",


          message:
            "Your wallet balance has been updated.",


        });


      }







      return transaction;



    });


  }





}





export const financialService =
  new FinancialService();