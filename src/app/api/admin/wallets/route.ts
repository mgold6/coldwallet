import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";

import {
  assignWalletSchema,
  updateWalletSchema,
} from "@/lib/validators/wallet";

import { authOptions } from "@/lib/auth";

import { walletService } from "@/server/services/wallet.service";



export async function POST(request: NextRequest) {

  try {

    const session =
      await getServerSession(authOptions);



    if (!session?.user) {

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );

    }



    if (
      (session.user as any).role !== "ADMIN"
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        {
          status: 403,
        }
      );

    }





    const body =
      await request.json();



    const result =
      assignWalletSchema.safeParse(body);



    if (!result.success) {

      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );

    }





    const wallet =
      await walletService.assignWallet({

        currentUserRole:
          UserRole.ADMIN,

        adminUserId:
          (session.user as any).id,

        portfolioId:
          result.data.portfolioId,

        currencyId:
          result.data.currencyId,

        networkId:
          result.data.networkId,

        address:
          result.data.address,

        label:
          result.data.label,

        generate:
          result.data.generate,

      });





    return NextResponse.json(
      {
        success: true,
        wallet,
      }
    );


  } catch (error) {


    console.error(
      "Assign Wallet Error:",
      error
    );


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






export async function PATCH(request: NextRequest) {

  try {


    const session =
      await getServerSession(authOptions);



    if (!session?.user) {

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );

    }




    if (
      (session.user as any).role !== "ADMIN"
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        {
          status: 403,
        }
      );

    }





    const body =
      await request.json();



    const result =
      updateWalletSchema.safeParse(body);



    if (!result.success) {

      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );

    }





    const wallet =
      await walletService.updateWallet({

        id:
          result.data.id,


        currentUserRole:
          UserRole.ADMIN,


        adminUserId:
          (session.user as any).id,


        label:
          result.data.label,


        status:
          result.data.status,


        assignedAt:
          result.data.assignedAt,


        notes:
          result.data.notes,

      });





    return NextResponse.json(
      {
        success: true,
        wallet,
      }
    );



  } catch (error) {


    console.error(
      "Update Wallet Error:",
      error
    );


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