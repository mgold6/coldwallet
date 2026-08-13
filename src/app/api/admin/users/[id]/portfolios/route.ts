import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import { auditService } from "@/server/services/audit.service";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

    const user =
      await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          portfolios: {
            include: {
              wallets: {
                include: {
                  currency: true,
                  network: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      portfolios: user.portfolios,
    });
  } catch (error) {
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

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

    const body = await request.json();

    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const portfolio =
      await prisma.portfolio.create({
        data: {
          userId: id,
          name: name.trim(),
        },
      });

    await auditService.create({
      action: "PORTFOLIO_CREATED",
      entity: "Portfolio",
      entityId: portfolio.id,
      metadata:
        `Portfolio ${portfolio.name} created for ${user.email}`,
    });

    return NextResponse.json({
      success: true,
      portfolio,
    });
  } catch (error) {
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

export async function PATCH(
  request: NextRequest
) {
  try {
    const { response } =
      await requireAdmin();

    if (response) {
      return response;
    }

    const body = await request.json();

    const {
      portfolioId,
      name,
      withdrawalsEnabled,
      withdrawalSuccessMessage,
      withdrawalErrorMessage,
    } = body;

    if (!portfolioId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Portfolio ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      name !== undefined &&
      (!name || !String(name).trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Portfolio name cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      withdrawalsEnabled !== undefined &&
      typeof withdrawalsEnabled !== "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Withdrawals enabled must be a boolean.",
        },
        {
          status: 400,
        }
      );
    }

    const portfolio =
      await prisma.portfolio.findUnique({
        where: {
          id: portfolioId,
        },
        include: {
          user: true,
        },
      });

    if (!portfolio) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Portfolio not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedPortfolio =
      await prisma.portfolio.update({
        where: {
          id: portfolioId,
        },
        data: {
          ...(name !== undefined
            ? {
                name: String(name).trim(),
              }
            : {}),

          ...(withdrawalsEnabled !== undefined
            ? {
                withdrawalsEnabled,
              }
            : {}),

          ...(withdrawalSuccessMessage !==
            undefined
            ? {
                withdrawalSuccessMessage:
                  withdrawalSuccessMessage ===
                  null
                    ? null
                    : String(
                        withdrawalSuccessMessage
                      ).trim(),
              }
            : {}),

          ...(withdrawalErrorMessage !==
            undefined
            ? {
                withdrawalErrorMessage:
                  withdrawalErrorMessage ===
                  null
                    ? null
                    : String(
                        withdrawalErrorMessage
                      ).trim(),
              }
            : {}),
        },
      });

    await auditService.create({
      action: "PORTFOLIO_UPDATED",
      entity: "Portfolio",
      entityId: portfolioId,
      metadata: JSON.stringify({
        portfolioId,
        userEmail: portfolio.user.email,
        nameChanged:
          name !== undefined &&
          String(name).trim() !==
            portfolio.name,
        withdrawalsEnabled:
          updatedPortfolio.withdrawalsEnabled,
        withdrawalSuccessMessage:
          updatedPortfolio.withdrawalSuccessMessage,
        withdrawalErrorMessage:
          updatedPortfolio.withdrawalErrorMessage,
      }),
    });

    return NextResponse.json({
      success: true,
      portfolio: updatedPortfolio,
    });
  } catch (error) {
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

export async function DELETE(
  request: NextRequest
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const body = await request.json();

    const { portfolioId } = body;

    if (!portfolioId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Portfolio ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const portfolio =
      await prisma.portfolio.findUnique({
        where: {
          id: portfolioId,
        },
        include: {
          user: true,
        },
      });

    if (!portfolio) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Portfolio not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.portfolio.delete({
      where: {
        id: portfolioId,
      },
    });

    await auditService.create({
      action: "PORTFOLIO_DELETED",
      entity: "Portfolio",
      entityId: portfolio.id,
      metadata:
        `Portfolio ${portfolio.name} deleted for ${portfolio.user.email}`,
    });

    return NextResponse.json({
      success: true,
      message:
        "Portfolio deleted successfully.",
    });
  } catch (error) {
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