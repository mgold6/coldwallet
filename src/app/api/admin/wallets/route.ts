import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

import { assignWalletSchema } from "@/lib/validators/wallet";
import { walletService } from "@/server/services/wallet.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = assignWalletSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const wallet = await walletService.assignWallet({
      currentUserRole: UserRole.ADMIN,

      portfolioId: result.data.portfolioId,

      currencyId: result.data.currencyId,

      networkId: result.data.networkId,

      address: result.data.address,

      label: result.data.label,
    });

    return NextResponse.json({
      success: true,
      wallet,
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