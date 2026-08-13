import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { userWalletService } from "@/server/services/user-wallet.service";
import { marketService } from "@/server/services/market.service";

import SendForm from "./components/SendForm";

interface SendPageProps {
  searchParams: Promise<{
    portfolioId?: string;
  }>;
}

export default async function SendPage({
  searchParams,
}: SendPageProps) {
  const session =
    await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId =
    (session.user as { id: string }).id;

  const params = await searchParams;

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        selectedPortfolioId: true,
        withdrawalsEnabled: true,
        withdrawalRestrictionMessage: true,
      },
    });

  if (!user) {
    redirect("/login");
  }

  const requestedPortfolioId =
    params.portfolioId?.trim();

  const portfolioId =
    requestedPortfolioId ||
    user.selectedPortfolioId;

  if (!portfolioId) {
    redirect("/dashboard/portfolio");
  }

  const portfolio =
    await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId,
        isActive: true,
      },
      select: {
        id: true,
        withdrawalsEnabled: true,
        withdrawalErrorMessage: true,
      },
    });

  if (!portfolio) {
    redirect("/dashboard/portfolio");
  }

  const [
    wallets,
    markets,
  ] = await Promise.all([
    userWalletService.getPortfolioWallets(
      portfolio.id
    ),

    marketService.getMarkets(),
  ]);

  /*
   * Withdrawal availability is controlled by:
   *
   * 1. Individual user setting
   * 2. Portfolio setting
   *
   * The global/master withdrawal switch is
   * intentionally not used here.
   */

  let withdrawalsEnabled = false;

  let withdrawalsEnabledMessage = "";

  if (!user.withdrawalsEnabled) {
    withdrawalsEnabled = false;

    /*
     * No availability banner is shown when
     * the individual user withdrawal control
     * is disabled.
     */
    withdrawalsEnabledMessage = "";
  } else if (!portfolio.withdrawalsEnabled) {
    withdrawalsEnabled = false;

    /*
     * No availability banner is shown when
     * the selected portfolio is disabled.
     */
    withdrawalsEnabledMessage = "";
  } else {
    withdrawalsEnabled = true;

    /*
     * Only show the availability banner when
     * both the user and portfolio are enabled.
     */
    withdrawalsEnabledMessage =
      "Withdrawals are currently available.";
  }

  const validWallets =
    wallets
      .filter(
        (wallet) =>
          wallet.address !== null
      )
      .map((wallet) => ({
        id: wallet.id,

        address:
          wallet.address!,

        availableBalance:
          Number(
            wallet.availableBalance
          ),

        currency: {
          code:
            wallet.currency.code,

          name:
            wallet.currency.name,
        },
      }));

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">
          Send Crypto
        </h1>

        <p className="mt-2 text-slate-400">
          Transfer digital assets securely.
        </p>
      </section>

      <SendForm
        wallets={validWallets}
        markets={markets}
        withdrawalsEnabled={
          withdrawalsEnabled
        }
        withdrawalsEnabledMessage={
          withdrawalsEnabledMessage
        }
      />
    </div>
  );
}