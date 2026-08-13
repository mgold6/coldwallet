import { NextResponse } from "next/server";

import { marketService } from "@/server/services/market.service";

export async function GET() {
  try {
    const markets =
      await marketService.getMarkets();

    return NextResponse.json(markets);
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to load market data",
      },
      {
        status: 500,
      }
    );
  }
}