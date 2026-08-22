import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getWalletBlockchainBalance } from "@/server/blockchain/balance.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        portfolio: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet not found.",
        },
        {
          status: 404,
        }
      );
    }

    const isAdmin = session.user.role === "ADMIN";

    const belongsToCurrentUser =
      wallet.portfolio.userId === session.user.id;

    if (!isAdmin && !belongsToCurrentUser) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not authorized to access this wallet.",
        },
        {
          status: 403,
        }
      );
    }

    const result = await getWalletBlockchainBalance(id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Blockchain balance lookup failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve blockchain balance.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 400,
      }
    );
  }
}