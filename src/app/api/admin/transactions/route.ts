import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { transactionService } from "@/server/services/transaction.service";

export async function GET() {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

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