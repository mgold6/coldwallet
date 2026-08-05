import { NextResponse } from "next/server";
import { depositService } from "@/server/services/deposit.service";

export async function GET() {
  try {
    const deposits = await depositService.getDeposits();
    const stats = await depositService.getStats();

    return NextResponse.json({
      success: true,
      data: deposits,
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