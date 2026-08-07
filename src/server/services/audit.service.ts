import prisma from "@/lib/prisma";


export class AuditService {


  async getLogs() {

    return prisma.auditLog.findMany({

      include: {
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 50,

    });

  }





  async create({

    userId,

    action,

    entity,

    entityId,

    metadata,

  }: {

    userId?: string;

    action: string;

    entity: string;

    entityId?: string;

    metadata?: string;

  }) {


    return prisma.auditLog.create({

      data: {

        userId,

        action,

        entity,

        entityId,

        metadata,

      },

    });


  }


}



export const auditService =
  new AuditService();