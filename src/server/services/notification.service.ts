import prisma from "@/lib/prisma";
import { NotificationType } from "@prisma/client";


export class NotificationService {


  async create({
    userId,
    type,
    title,
    message,
  }: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
  }) {


    return prisma.notification.create({

      data: {

        userId,

        type,

        title,

        message,

      },

    });


  }





  async getUserNotifications(
    userId:string
  ) {


    return prisma.notification.findMany({

      where:{
        userId,
      },


      orderBy:{
        createdAt:"desc",
      },


      take:50,


    });


  }





  async markAsRead(
    id:string
  ) {


    return prisma.notification.update({

      where:{
        id,
      },


      data:{
        isRead:true,
      },


    });


  }



}


export const notificationService =
  new NotificationService();