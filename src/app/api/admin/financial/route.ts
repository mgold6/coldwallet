import { NextRequest, NextResponse } from "next/server";

import { financialService } from "@/server/services/financial.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    switch (body.action) {
      case "deposit": {
        const transaction =
          await financialService.manualDeposit({
            walletId: body.walletId,
            amount: Number(body.amount),
            notes: body.notes,
          });

        return NextResponse.json({
          success: true,
          transaction,
        });
      }

      case "withdraw": {
        const transaction =
          await financialService.manualWithdrawal({
            walletId: body.walletId,
            amount: Number(body.amount),
            destinationAddress: body.destinationAddress,
            notes: body.notes,
          });

        return NextResponse.json({
          success: true,
          transaction,
        });
      }

      case "adjust": {
        await financialService.adjustBalance({
          walletId: body.walletId,
          amount: Number(body.amount),
          notes: body.notes,
        });

        return NextResponse.json({
          success: true,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Unknown action.",
          },
          {
            status: 400,
          }
        );
    }
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