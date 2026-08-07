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



    const {
      walletId,
      amount,
      toAddress,
    } = body;



    if (
      !walletId ||
      !amount ||
      !toAddress
    ) {

      return NextResponse.json(
        {
          error:
            "Wallet, amount, and recipient address are required.",
        },
        {
          status: 400,
        }
      );

    }




    const transaction =
      await transactionService.createWithdrawal({

        walletId,

        amount,

        toAddress,

      });



    return NextResponse.json(
      {
        success: true,
        transaction,
      },
      {
        status: 201,
      }
    );


  } catch (error: any) {


    return NextResponse.json(
      {
        error:
          error.message ??
          "Unable to create transaction.",
      },
      {
        status: 500,
      }
    );

  }

}