import { NextResponse } from "next/server";
import { transactionService } from "@/server/services/transaction.service";

export async function GET() {
  try {
    const transactions =
      await transactionService.getAllTransactions();

    return NextResponse.json({
      success: true,
      data: transactions,
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