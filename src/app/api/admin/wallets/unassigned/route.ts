import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { response } =
      await requireAdmin();

    if (response) {
      return response;
    }

    const wallets =
      await prisma.wallet.findMany({
        where: {
          status: "ACTIVE",
        },

        include: {
          currency: true,
          network: true,
          portfolio: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      wallets,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error.",
      },
      {
        status: 500,
      }
    );
  }
}