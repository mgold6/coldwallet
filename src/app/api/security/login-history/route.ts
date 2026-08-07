import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import prisma from "@/lib/prisma";



export async function GET() {


  try {


    const session =
      await getServerSession(authOptions);




    if (!session) {

      return NextResponse.json(

        {
          error: "Unauthorized",
        },

        {
          status:401,
        }

      );

    }




    const userId =
      (session.user as any).id;






    const logs =
      await prisma.loginHistory.findMany({

        where: {

          userId,

        },


        orderBy: {

          createdAt: "desc",

        },


        take: 10,

      });






    return NextResponse.json(logs);



  } catch(error) {


    console.error(
      "Login history error:",
      error
    );


    return NextResponse.json(

      {
        error:
          "Unable to load login history.",
      },

      {
        status:500,
      }

    );


  }


}