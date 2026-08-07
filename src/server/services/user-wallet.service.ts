import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


export class UserWalletService {


  async getUserWallets(userId: string) {


    const wallets =
      await prisma.wallet.findMany({

        where: {

          portfolio: {

            userId,

          },

        },


        include: {

          currency: true,

          network: true,

        },


        orderBy: {

          createdAt: "asc",

        },

      });





    const grouped =
      wallets.reduce((acc: any[], wallet) => {


        const existing =
          acc.find(

            (item) =>
              item.currencyId === wallet.currencyId

          );



        if (existing) {


          existing.balance =
            new Prisma.Decimal(
              existing.balance
            ).add(
              wallet.availableBalance
            );


          existing.availableBalance =
            new Prisma.Decimal(
              existing.availableBalance
            ).add(
              wallet.availableBalance
            );



        } else {


          acc.push({

            ...wallet,


            balance:
              wallet.availableBalance,


            availableBalance:
              wallet.availableBalance,


          });


        }



        return acc;


      }, []);





    return grouped;


  }


}



export const userWalletService =
  new UserWalletService();