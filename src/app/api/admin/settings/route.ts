import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import prisma from "@/lib/prisma";


export async function POST(
  request: Request
) {

  try {

    const session =
      await getServerSession(
        authOptions
      );


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


    const body =
      await request.json();


    const {
      key,
      value,
      description,
    } = body;


    if (
      !key ||
      !value
    ) {

      return NextResponse.json(
        {
          error:
            "Key and value are required.",
        },
        {
          status: 400,
        }
      );

    }
        const setting =
      await prisma.systemSetting.upsert({

        where: {
          key,
        },


        update: {

          value,

          description,

        },


        create: {

          key,

          value,

          description,

        },

      });



    return NextResponse.json(
      {
        success: true,
        setting,
      },
      {
        status: 200,
      }
    );


  } catch (error: any) {


    return NextResponse.json(
      {
        error:
          error.message ??
          "Unable to save settings.",
      },
      {
        status: 500,
      }
    );


  }

}