import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";



export async function GET(
  request: NextRequest
) {

try {


const wallets =
  await prisma.wallet.findMany({

    where: {

      status: "ACTIVE",

    },


    include: {

      currency:true,

      network:true,

      portfolio:true,

    },


    orderBy: {

      createdAt:"desc",

    },


  });




return NextResponse.json({

  success:true,

  wallets,

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