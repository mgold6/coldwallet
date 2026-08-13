import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { transactionService } from "@/server/services/transaction.service";

export async function POST(
  request: Request
) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const {
      walletId,
      amount,
      toAddress,
    } = body;

    if (
      !walletId ||
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !toAddress
    ) {
      return NextResponse.json(
        {
          error:
            "Wallet, USD amount, and recipient address are required.",
        },
        {
          status: 400,
        }
      );
    }

    const transaction =
      await transactionService.createWithdrawal({
        walletId,

        /*
         * The user-facing withdrawal amount is USD.
         *
         * Example:
         * amount = "100"
         *
         * The transaction service converts that
         * USD amount into the wallet's cryptocurrency.
         */
        usdAmount: String(amount),

        toAddress,
      });

    return NextResponse.json(
  {
    success: true,
    transaction,
    message:
      transaction.successMessage ??
      "Your withdrawal request has been submitted successfully and is awaiting administrator review.",
  },
  {
    status: 201,
  }
);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create withdrawal request.",
      },
      {
        status: 500,
      }
    );
  }
}