import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import prisma from "@/lib/prisma";



export async function POST(
  request: Request
) {


  try {


    const session =
      await getServerSession(authOptions);



    if (!session) {

      return NextResponse.json(

        {
          error: "Unauthorized",
        },

        {
          status: 401,
        }

      );

    }





    const userId =
      (session.user as any).id;





    const {
      enabled,
    } = await request.json();






    await prisma.user.update({

      where: {

        id: userId,

      },


      data: {

        isTwoFactorEnabled:
          Boolean(enabled),

      },

    });







    return NextResponse.json({

      success: true,

      enabled:

        Boolean(enabled),

    });




  } catch(error) {


    console.error(
      "2FA update error:",
      error
    );



    return NextResponse.json(

      {
        error:
          "Unable to update 2FA.",
      },

      {
        status: 500,
      }

    );


  }

}