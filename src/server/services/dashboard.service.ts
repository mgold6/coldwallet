import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { userRepository } from "@/server/repositories/user.repository";
import { marketService } from "@/server/services/market.service";


export class DashboardService {


  // ----------------------------
  // Admin Dashboard
  // ----------------------------

  async getStats() {


    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalWallets,
      totalPortfolios,
      totalTransactions,
      pendingTransactions,
      pendingWithdrawals,

    ] = await Promise.all([


      prisma.user.count(),


      prisma.user.count({
        where: {
          status: "ACTIVE",
        },
      }),


      prisma.user.count({
        where: {
          status: "PENDING",
        },
      }),


      prisma.wallet.count(),


      prisma.portfolio.count(),


      prisma.transaction.count(),


      prisma.transaction.count({
        where: {
          status: "PENDING",
        },
      }),


      prisma.withdrawal.count({
        where: {
          processed: false,
        },
      }),


    ]);



    return {

      totalUsers,

      activeUsers,

      pendingUsers,

      totalWallets,

      totalPortfolios,

      totalTransactions,

      pendingTransactions,

      pendingWithdrawals,

    };


  }







  async getRecentAuditLogs() {

    return prisma.auditLog.findMany({

      include: {

        user: true,

      },

      orderBy: {

        createdAt: "desc",

      },

      take: 10,

    });

  }







  async getTransactionStats() {


    const [

      pending,

      completed,

      failed,

      total,

    ] = await Promise.all([


      prisma.transaction.count({

        where: {

          status: "PENDING",

        },

      }),



      prisma.transaction.count({

        where: {

          status: "COMPLETED",

        },

      }),



      prisma.transaction.count({

        where: {

          status: "FAILED",

        },

      }),



      prisma.transaction.count(),


    ]);



    return {

      pending,

      completed,

      failed,

      total,

    };


  }







  async getWithdrawalStats() {


    const [

      pending,

      processed,

      total,

    ] = await Promise.all([


      prisma.withdrawal.count({

        where: {

          processed: false,

        },

      }),



      prisma.withdrawal.count({

        where: {

          processed: true,

        },

      }),



      prisma.withdrawal.count(),


    ]);



    return {

      pending,

      processed,

      total,

    };


  }







  async getSecurityStats() {


    const [

      successfulLogins,

      failedLogins,

    ] = await Promise.all([


      prisma.loginHistory.count({

        where: {

          success: true,

        },

      }),



      prisma.loginHistory.count({

        where: {

          success: false,

        },

      }),


    ]);



    return {

      successfulLogins,

      failedLogins,

    };


  }









  // ----------------------------
  // Financial Analytics
  // ----------------------------

  async getFinancialStats() {


    const [

      totalDeposits,

      confirmedDeposits,

      totalWithdrawals,

      processedWithdrawals,

      pendingWithdrawalAmount,

      transactionVolume,

    ] = await Promise.all([


      prisma.deposit.aggregate({

        _sum: {

          amount: true,

        },

      }),



      prisma.deposit.aggregate({

        where: {

          confirmed: true,

        },

        _sum: {

          amount: true,

        },

      }),



      prisma.withdrawal.aggregate({

        _sum: {

          amount: true,

        },

      }),



      prisma.withdrawal.aggregate({

        where: {

          processed: true,

        },

        _sum: {

          amount: true,

        },

      }),



      prisma.withdrawal.aggregate({

        where: {

          processed: false,

        },

        _sum: {

          amount: true,

        },

      }),



      prisma.transaction.aggregate({

        _sum: {

          amount: true,

        },

      }),


    ]);






    return {

      totalDeposits:
        totalDeposits._sum.amount ?? 0,


      confirmedDeposits:
        confirmedDeposits._sum.amount ?? 0,


      totalWithdrawals:
        totalWithdrawals._sum.amount ?? 0,


      processedWithdrawals:
        processedWithdrawals._sum.amount ?? 0,


      pendingWithdrawalAmount:
        pendingWithdrawalAmount._sum.amount ?? 0,


      transactionVolume:
        transactionVolume._sum.amount ?? 0,

    };


  }









  async getUsers() {

    return userRepository.findAllWithPortfolios();

  }









  async getUserDetails(userId: string) {


    return prisma.user.findUnique({

      where: {

        id: userId,

      },


      include: {

        portfolios: {

          include: {

            wallets: {

              include: {

                currency: true,

                network: true,


                deposits: {

                  orderBy: {

                    createdAt: "desc",

                  },

                  take: 5,

                },


                withdrawals: {

                  orderBy: {

                    createdAt: "desc",

                  },

                  take: 5,

                },


                transactions: {

                  orderBy: {

                    createdAt: "desc",

                  },

                  take: 10,

                },


              },

            },

          },

        },

      },


    });


  }









  // ----------------------------
  // User Dashboard
  // ----------------------------


  async getDashboardStats(userId: string) {


    const portfolios =
      await prisma.portfolio.findMany({

        where: {

          userId,

        },


        include: {

          wallets: {

            include: {

              currency: true,

            },

          },

        },

      });






    const markets =
      await marketService.getMarkets();





    let portfolioValue =
      new Prisma.Decimal(0);

    let activeWallets = 0;







    for (const portfolio of portfolios) {


      for (const wallet of portfolio.wallets) {


        const market =
          markets.find(

            (coin) =>

              coin.symbol.toUpperCase() ===
              wallet.currency.code.toUpperCase()

          );




        if (market) {


          const usdValue =

            Number(wallet.availableBalance) *

            market.current_price;



          portfolioValue =
            portfolioValue.plus(usdValue);


        }





        if (wallet.status === "ACTIVE") {

          activeWallets++;

        }


      }


    }







    const depositCount =
      await prisma.deposit.count({

        where: {

          wallet: {

            portfolio: {

              userId,

            },

          },

        },

      });







    const withdrawalCount =
      await prisma.withdrawal.count({

        where: {

          wallet: {

            portfolio: {

              userId,

            },

          },

        },

      });






    return {


      portfolioValue:
        portfolioValue.toFixed(2),


      activeWallets,


      depositCount,


      withdrawalCount,


      todaysProfit:
        "0.00",


      securityScore:
        98,


    };


  }


}





export const dashboardService =
  new DashboardService();