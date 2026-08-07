import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRole } from "@prisma/client";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { walletService } from "@/server/services/wallet.service";
import { auditService } from "@/server/services/audit.service";

interface Params {
  params: Promise<{
    id: string;
    portfolioId: string;
  }>;
}


// GET WALLET LIST
export async function GET(
  request: NextRequest,
  {
    params,
  }: Params
) {

  try {

    const {
      id,
      portfolioId,
    } = await params;



    const portfolio =
      await prisma.portfolio.findFirst({

        where: {
          id: portfolioId,
          userId: id,
        },

        include: {

          wallets: {

            include: {

              currency: true,

              network: true,

            },

            orderBy: {
              createdAt: "desc",
            },

          },

        },

      });



    if (!portfolio) {

      return NextResponse.json(
        {
          success: false,
          message: "Portfolio not found.",
        },
        {
          status: 404,
        }
      );

    }



    return NextResponse.json({

      success: true,

      wallets:
        portfolio.wallets,

    });



  } catch(error) {

    return NextResponse.json(

      {

        success:false,

        message:
          error instanceof Error
            ? error.message
            : "Server error.",

      },

      {
        status:500,
      }

    );

  }

}




// CREATE / ASSIGN / IMPORT WALLET
export async function POST(
  request: NextRequest,
  {
    params,
  }: Params
) {

  try {


    const session =
      await getServerSession(authOptions);



    if (!session?.user) {

      return NextResponse.json(
        {
          success:false,
          message:"Unauthorized.",
        },
        {
          status:401,
        }
      );

    }



    const {
      portfolioId,
    } = await params;



    const body =
      await request.json();



    const {
      mode,
      currencyId,
      networkId,
      address,
      label,
    } = body;



    let wallet;



    /*
      IMPORT EXISTING ADDRESS
    */

    if (mode === "import") {


      if (!address || !currencyId) {

        return NextResponse.json(
          {
            success:false,
            message:
              "Wallet address and currency are required.",
          },
          {
            status:400,
          }
        );

      }



      wallet =
        await walletService.assignWallet({

          currentUserRole:
            UserRole.ADMIN,


          adminUserId:
            (session.user as any).id,


          portfolioId,


          currencyId,


          networkId,


          address,


          label,


          generate:false,

        });



    }


    /*
      GENERATE NEW WALLET
    */

    else {


      if (!currencyId) {

        return NextResponse.json(
          {
            success:false,
            message:"Currency required.",
          },
          {
            status:400,
          }
        );

      }



      wallet =
        await walletService.assignWallet({

          currentUserRole:
            UserRole.ADMIN,


          adminUserId:
            (session.user as any).id,


          portfolioId,


          currencyId,


          networkId,


          generate:true,

        });


    }





    await auditService.create({

      action:
        "WALLET_ASSIGNED",


      entity:
        "Wallet",


      entityId:
        wallet.id,


      metadata:
        `Wallet assigned to portfolio ${portfolioId}`,

    });





    return NextResponse.json({

      success:true,

      wallet,

    });



  } catch(error) {


    return NextResponse.json(

      {

        success:false,

        message:
          error instanceof Error
            ? error.message
            : "Server error.",

      },

      {
        status:500,
      }

    );

  }

}





// DELETE WALLET
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: Params
) {

  try {


    const {
      portfolioId,
    } = await params;



    const body =
      await request.json();



    const {
      walletId,
    } = body;



    if (!walletId) {

      return NextResponse.json(
        {
          success:false,
          message:"Wallet ID required.",
        },
        {
          status:400,
        }
      );

    }



    const wallet =
      await prisma.wallet.findFirst({

        where:{
          id:walletId,
          portfolioId,
        },

      });



    if (!wallet) {

      return NextResponse.json(
        {
          success:false,
          message:"Wallet not found.",
        },
        {
          status:404,
        }
      );

    }



    await prisma.wallet.delete({

      where:{
        id:walletId,
      },

    });





    await auditService.create({

      action:
        "WALLET_DELETED",


      entity:
        "Wallet",


      entityId:
        walletId,


      metadata:
        `Wallet removed from portfolio ${portfolioId}`,

    });





    return NextResponse.json({

      success:true,

      message:"Wallet deleted.",

    });



  } catch(error) {


    return NextResponse.json(

      {

        success:false,

        message:
          error instanceof Error
            ? error.message
            : "Server error.",

      },

      {
        status:500,
      }

    );

  }

}