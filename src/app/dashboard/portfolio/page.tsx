import Image from "next/image";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import prisma from "@/lib/prisma";

import { marketService } from "@/server/services/market.service";
import { userWalletService } from "@/server/services/user-wallet.service";

import PortfolioSelector from "@/components/dashboard/PortfolioSelector";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId =
    (session.user as { id: string }).id;

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        selectedPortfolioId: true,
      },
    });

  const [
    portfolios,
    markets,
  ] = await Promise.all([
    prisma.portfolio.findMany({
      where: {
        userId,
        isActive: true,
      },

      orderBy: [
        {
          isDefault: "desc",
        },

        {
          createdAt: "asc",
        },
      ],
    }),

    marketService.getMarkets(),
  ]);

  const activePortfolio =
    portfolios.find(
      (portfolio) =>
        portfolio.id ===
        user?.selectedPortfolioId
    ) ??
    portfolios.find(
      (portfolio) =>
        portfolio.isDefault
    ) ??
    portfolios[0];

  let wallets: Awaited<
    ReturnType<
      typeof userWalletService.getPortfolioWallets
    >
  > = [];

  if (activePortfolio) {
    wallets =
      await userWalletService.getPortfolioWallets(
        activePortfolio.id
      );
  }

  const holdings = wallets.map(
    (wallet) => {
      const symbol =
        wallet.currency.code.toUpperCase();

      const market =
        markets.find(
          (coin) =>
            coin.symbol.toUpperCase() ===
            symbol
        );

      const balance =
        Number(
          wallet.balance ?? 0
        );

      const value =
        market
          ? balance *
            market.current_price
          : 0;

      return {
        id: wallet.id,

        symbol,

        name:
          wallet.currency.name,

        image:
          market?.image ?? null,

        price:
          market?.current_price ?? 0,

        balance,

        value,

        change:
          market?.price_change_percentage_24h ??
          0,
      };
    }
  );

  const totalBalance =
    holdings.reduce(
      (total, item) =>
        total + item.value,
      0
    );

  const totalChange =
    holdings.reduce(
      (total, item) =>
        total +
        (
          item.value *
          (
            item.change / 100
          )
        ),
      0
    );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Portfolio
        </h1>

        <p className="mt-2 text-slate-400">
          Select a portfolio to manage its wallets and holdings.
        </p>
      </div>

      {/* Portfolio Selector */}

      <PortfolioSelector
        portfolios={portfolios}
        selectedId={
          activePortfolio?.id ?? ""
        }
      />

      {/* Selected Portfolio */}

      {activePortfolio && (
        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-sm text-slate-400">
                Selected Portfolio
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-white
                "
              >
                {activePortfolio.name}
              </h2>
            </div>

            {/* Portfolio Actions */}

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >
              <Link
                href={`/dashboard/send?portfolioId=${encodeURIComponent(
                  activePortfolio.id
                )}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-cyan-400
                  px-5
                  py-3
                  font-semibold
                  text-slate-950
                  transition
                  hover:bg-cyan-300
                "
              >
                <span className="text-lg">
                  ↗
                </span>

                Send
              </Link>

              <Link
                href={`/dashboard/receive?portfolioId=${encodeURIComponent(
                  activePortfolio.id
                )}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-800
                  px-5
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-slate-700
                "
              >
                <span className="text-lg">
                  ↓
                </span>

                Receive
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-2">
        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
          "
        >
          <p className="text-sm text-slate-400">
            Total Balance
          </p>

          <p
            className="
              mt-2
              text-4xl
              font-bold
              text-white
            "
          >
            $
            {totalBalance.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
          "
        >
          <p className="text-sm text-slate-400">
            24H Performance
          </p>

          <p
            className={`
              mt-2
              text-4xl
              font-bold
              ${
                totalChange >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            `}
          >
            {totalChange >= 0
              ? "+"
              : "-"}
            $

            {Math.abs(
              totalChange
            ).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>
        </div>
      </div>

      {/* Assigned Wallets */}

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
        "
      >
        <div
          className="
            border-b
            border-slate-800
            p-6
          "
        >
          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Assigned Wallets
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-400
            "
          >
            Wallets assigned to the selected portfolio.
          </p>
        </div>

        <div className="p-6">
          {holdings.length === 0 ? (
            <div
              className="
                py-10
                text-center
                text-slate-400
              "
            >
              No assigned wallets in this portfolio.
            </div>
          ) : (
            <div className="space-y-3">
              {holdings.map(
                (asset) => (
                  <div
                    key={asset.id}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-slate-800
                      bg-slate-950
                      p-5
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          bg-slate-800
                        "
                      >
                        {asset.image ? (
                          <Image
                            src={asset.image}
                            alt={asset.name}
                            width={40}
                            height={40}
                            className="
                              h-10
                              w-10
                            "
                          />
                        ) : (
                          <span
                            className="
                              text-xl
                              text-cyan-400
                            "
                          >
                            ◉
                          </span>
                        )}
                      </div>

                      <div>
                        <p
                          className="
                            font-semibold
                            text-white
                          "
                        >
                          {asset.name}
                        </p>

                        <p
                          className="
                            text-sm
                            text-slate-400
                          "
                        >
                          {asset.balance.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 8,
                            }
                          )}

                          {" "}

                          {asset.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className="
                          font-bold
                          text-white
                        "
                      >
                        $

                        {asset.value.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                      {/* 24H Performance — preserved */}

                      <p
                        className={`
                          text-sm
                          font-medium
                          ${
                            asset.change >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        `}
                      >
                        {asset.change >= 0
                          ? "+"
                          : ""}

                        {asset.change.toFixed(
                          2
                        )}
                        %
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
