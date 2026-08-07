import prisma from "@/lib/prisma";

import {
  Prisma,
  Transaction,
  TransactionStatus,
} from "@prisma/client";



type TransactionWithRelations =
  Prisma.TransactionGetPayload<{
    include: {
      wallet: true;
      currency: true;
      network: true;
    };
  }>;



type TransactionWithUser =
  Prisma.TransactionGetPayload<{
    include: {
      wallet: {
        include: {
          portfolio: true;
        };
      };
      currency: true;
      network: true;
    };
  }>;





export class TransactionRepository {



  async findById(
    id: string
  ): Promise<TransactionWithRelations | null> {


    return prisma.transaction.findUnique({

      where: {
        id,
      },


      include: {

        wallet: true,

        currency: true,

        network: true,

      },

    });

  }







  async findByIdForUser(
    id: string,
    userId: string
  ): Promise<TransactionWithUser | null> {


    return prisma.transaction.findFirst({

      where: {

        id,


        wallet: {

          portfolio: {

            userId,

          },

        },

      },


      include: {

        wallet: {

          include: {

            portfolio: true,

          },

        },


        currency: true,


        network: true,


      },


    });

  }







  async findByHash(
    txHash: string
  ): Promise<Transaction | null> {


    return prisma.transaction.findFirst({

      where: {

        txHash,

      },

    });

  }








  async findByWallet(
    walletId: string
  ): Promise<TransactionWithRelations[]> {


    return prisma.transaction.findMany({

      where: {

        walletId,

      },


      include: {

        wallet: true,

        currency: true,

        network: true,

      },


      orderBy: {

        createdAt: "desc",

      },

    });

  }








  async findPending(): Promise<TransactionWithRelations[]> {


    return prisma.transaction.findMany({

      where: {

        status: TransactionStatus.PENDING,

      },


      include: {

        wallet: true,

        currency: true,

        network: true,

      },


      orderBy: {

        createdAt: "asc",

      },

    });

  }








  async create(
    data: Prisma.TransactionCreateInput
  ): Promise<Transaction> {


    return prisma.transaction.create({

      data,

    });

  }








  async update(
    id: string,
    data: Prisma.TransactionUpdateInput
  ): Promise<Transaction> {


    return prisma.transaction.update({

      where: {

        id,

      },


      data,

    });

  }








  async list(): Promise<TransactionWithRelations[]> {


    return prisma.transaction.findMany({

      include: {

        wallet: true,

        currency: true,

        network: true,

      },


      orderBy: {

        createdAt: "desc",

      },

    });

  }


}




export const transactionRepository =
  new TransactionRepository();