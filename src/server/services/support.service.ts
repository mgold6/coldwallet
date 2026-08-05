import prisma from "@/lib/prisma";

export class SupportService {
  async getTickets() {
    return prisma.supportTicket.findMany({
      include: {
        user: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getTicketById(id: string) {
    return prisma.supportTicket.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        messages: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }
}

export const supportService = new SupportService();