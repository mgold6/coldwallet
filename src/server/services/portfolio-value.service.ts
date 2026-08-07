import prisma from "@/lib/prisma";
import { marketService } from "./market.service";
import { Prisma } from "@prisma/client";

export class PortfolioValueService {

  async getUserPortfolioValue(userId: string) {

    const wallets = await prisma.wallet.findMany({
      where: {
        portfolio: {
          userId,
        },
      },
      include: {
        currency: true,
      },
    });


    const markets =
      await marketService.getMarkets();


    let total = new Prisma.Decimal(0);


    for (const wallet of wallets) {

      const coin =
        markets.find(
          (market) =>
            market.symbol.toUpperCase() ===
            wallet.currency.code.toUpperCase()
        );


      if (!coin) continue;


      const value =
        Number(wallet.availableBalance) *
        coin.current_price;


      total = total.plus(value);
    }


    return total.toFixed(2);
  }
}


export const portfolioValueService =
  new PortfolioValueService();