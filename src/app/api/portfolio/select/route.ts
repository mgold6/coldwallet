import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId =
      session.user.id;

    const body =
      await req.json();

    const {
      portfolioId,
    } = body;

    if (!portfolioId) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio ID required",
        },
        {
          status: 400,
        }
      );
    }

    const portfolio =
      await prisma.portfolio.findFirst({
        where: {
          id: portfolioId,
          userId,
        },
      });

    if (!portfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        selectedPortfolioId:
          portfolioId,
      },
    });

    return NextResponse.json({
      success: true,
      selectedPortfolioId:
        portfolioId,
    });
  } catch (error) {
    console.error(
      "SELECT PORTFOLIO ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed selecting portfolio",
      },
      {
        status: 500,
      }
    );
  }
}