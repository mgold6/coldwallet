import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { withdrawalService } from "@/server/services/withdrawal.service";

export async function GET() {
  try {
    const { response } =
      await requireAdmin();

    if (response) {
      return response;
    }

    const withdrawals =
      await withdrawalService.getWithdrawals();

    const stats =
      await withdrawalService.getStats();

    return NextResponse.json({
      success: true,
      data: withdrawals,
      stats,
    });
  } catch (error) {
    console.error(
      "ADMIN WITHDRAWALS GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load withdrawals.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const { session, response } =
      await requireAdmin();

    if (response) {
      return response;
    }

    const body =
      await request.json();

    const {
      action,
      withdrawalId,
      reason,
    } = body;

    if (!withdrawalId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Withdrawal ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    let result;

    switch (action) {
      case "approve":
        result =
          await withdrawalService.approveWithdrawal(
            withdrawalId
          );
        break;

      case "reject":
      case "decline":
        result =
          await withdrawalService.rejectWithdrawal(
            withdrawalId,
            reason
          );
        break;

      case "process":
        result =
          await withdrawalService.processWithdrawal(
            withdrawalId
          );
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid withdrawal action.",
          },
          {
            status: 400,
          }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      adminUserId:
        session?.user?.id ?? null,
    });
  } catch (error) {
    console.error(
      "ADMIN WITHDRAWAL ACTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to process withdrawal action.",
      },
      {
        status: 500,
      }
    );
  }
}