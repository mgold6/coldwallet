import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { transactionService } from "@/server/services/transaction.service";


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



    const body =
      await request.json();



    const transaction =
      await transactionService.createSwap({

        fromWalletId:
          body.fromWalletId,

        toWalletId:
          body.toWalletId,

        amount:
          body.amount,

      });



    return NextResponse.json(
      transaction
    );



  } catch(error:any) {


    return NextResponse.json(

      {
        error:
          error.message ||
          "Swap failed",
      },

      {
        status:500,
      }

    );

  }

}