import { NextResponse } from "next/server";

import { financialService } from "@/server/services/financial.service";


export async function POST(req: Request) {

  try {

    const body = await req.json();


    const {
      action,
      walletId,
      amount,
      notes,
      destinationAddress,

      transactionSource,
      balanceEffect,
      showInHistory,
      sendNotification,

      txHash,
      blockchainNetwork,
      explorerUrl,
      blockchainVerified,

    } = body;



    if (!walletId) {

      return NextResponse.json(
        {
          success: false,
          message: "Wallet ID is required.",
        },
        {
          status: 400,
        }
      );

    }



    const normalizedAction =
      String(action).toUpperCase();



    let result;



    if (normalizedAction === "DEPOSIT") {


      result =
        await financialService.manualDeposit({

          walletId,

          usdAmount:
            Number(amount),

          notes,

          transactionSource,

          balanceEffect,

          showInHistory,

          sendNotification,

          txHash,

          blockchainNetwork,

          explorerUrl,

          blockchainVerified,

        });


    }


    else if (normalizedAction === "WITHDRAWAL") {


      result =
        await financialService.manualWithdrawal({

          walletId,

          amount:
            Number(amount),

          destinationAddress,

          notes,

          transactionSource,

          balanceEffect,

          showInHistory,

          sendNotification,

          txHash,

          blockchainNetwork,

          explorerUrl,

          blockchainVerified,

        });


    }


    else if (normalizedAction === "ADJUSTMENT") {


      result =
        await financialService.adjustBalance({

          walletId,

          amount:
            Number(amount),

          notes,

          transactionSource,

          balanceEffect,

          showInHistory,

          sendNotification,

        });


    }


    else {

      return NextResponse.json(
        {
          success:false,
          message:"Invalid financial action.",
        },
        {
          status:400,
        }
      );

    }



    return NextResponse.json({

      success:true,

      transaction:result,

    });



  } catch(error) {


    console.error(
      "Financial operation error:",
      error
    );


    return NextResponse.json(
      {
        success:false,

        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status:500,
      }
    );

  }

}