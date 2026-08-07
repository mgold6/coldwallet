import { NextRequest, NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";

import prisma from "@/lib/prisma";
import { auditService } from "@/server/services/audit.service";


export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } = await params;


    const body = await request.json();


    const {
      role,
      status,
      firstName,
      lastName,
    } = body;



    const existingUser =
      await prisma.user.findUnique({
        where: {
          id,
        },
      });



    if (!existingUser) {

      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );

    }




    const updatedUser =
      await prisma.user.update({

        where: {
          id,
        },

        data: {

          ...(role
            ? {
                role: role as UserRole,
              }
            : {}),


          ...(status
            ? {
                status: status as UserStatus,
              }
            : {}),


          ...(firstName !== undefined
            ? {
                firstName,
              }
            : {}),


          ...(lastName !== undefined
            ? {
                lastName,
              }
            : {}),

        },

      });







    if (
      role &&
      role !== existingUser.role
    ) {

      await auditService.create({

        action:
          "USER_ROLE_CHANGED",

        entity:
          "User",

        entityId:
          updatedUser.id,

        metadata:
          `Role changed from ${existingUser.role} to ${updatedUser.role} for ${updatedUser.email}`,

      });

    }







    if (
      status &&
      status !== existingUser.status
    ) {


      await auditService.create({

        action:
          "USER_STATUS_CHANGED",

        entity:
          "User",

        entityId:
          updatedUser.id,

        metadata:
          `Status changed from ${existingUser.status} to ${updatedUser.status} for ${updatedUser.email}`,

      });


    }








    if (
      firstName !== undefined ||
      lastName !== undefined
    ) {


      await auditService.create({

        action:
          "USER_UPDATED",

        entity:
          "User",

        entityId:
          updatedUser.id,

        metadata:
          `Profile updated for ${updatedUser.email}`,

      });


    }






    return NextResponse.json({

      success: true,

      user: updatedUser,

    });



  } catch(error) {


    return NextResponse.json(

      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },

      {
        status: 500,
      }

    );


  }

}