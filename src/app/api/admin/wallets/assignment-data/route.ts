import { NextResponse } from "next/server";

import { adminWalletService } from "@/server/services/admin-wallet.service";


export async function GET(
  request: Request
) {

  const { searchParams } =
    new URL(request.url);


  const userId =
    searchParams.get("userId");


  if (!userId) {

    return NextResponse.json(
      {
        success: false,
        message: "Missing userId.",
      },
      {
        status: 400,
      }
    );

  }


  try {

    const data =
      await adminWalletService.getAssignmentData(
        userId
      );


    return NextResponse.json({

      success: true,

      data: {

        portfolios:
          data.portfolios ?? [],

        currencies:
          data.currencies ?? [],

      },

    });


  } catch (error) {


    console.error(
      "ASSIGNMENT DATA ERROR:",
      error
    );


    return NextResponse.json(

      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unknown error.",

      },

      {
        status: 500,
      }

    );

  }

}