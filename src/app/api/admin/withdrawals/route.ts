import { NextResponse } from "next/server";
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