import { NextRequest, NextResponse } from "next/server";
import { withdrawalService } from "@/server/services/withdrawal.service";

export async function GET() {
  try {
    const withdrawals = await withdrawalService.getWithdrawals();
    const stats = await withdrawalService.getStats();

    return NextResponse.json({
      success: true,
      data: withdrawals,
      stats,
    });
  } catch (error) {
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

export async function POST(request: NextRequest) {
  try {
    const { action, withdrawalId } = await request.json();

    switch (action) {
      case "approve":
        await withdrawalService.approveWithdrawal(withdrawalId);
        break;

      case "reject":
        await withdrawalService.rejectWithdrawal(withdrawalId);
        break;

      case "process":
        await withdrawalService.processWithdrawal(withdrawalId);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid action.",
          },
          {
            status: 400,
          }
        );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
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