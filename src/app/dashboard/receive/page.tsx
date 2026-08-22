import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import prisma from "@/lib/prisma";

import { userWalletService } from "@/server/services/user-wallet.service";

import ReceiveWallet from "./components/ReceiveWallet";

interface ReceivePageProps {
  searchParams: Promise<{
    portfolioId?: string;
    asset?: string;
  }>;
}

export default async function ReceivePage({
  searchParams,
}: ReceivePageProps) {
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
      },
    });

  if (!portfolio) {
    redirect("/dashboard/portfolio");
  }

  const wallets =
    await userWalletService.getPortfolioWallets(
      portfolio.id
    );

  const validWallets = wallets
    .filter(
      (wallet) =>
        wallet.address !== null
    )
    .map((wallet) => ({
      ...wallet,
      address: wallet.address!,
    }));

  const requestedAsset =
    params.asset
      ?.trim()
      .toUpperCase();

  const initialWallet =
    requestedAsset
      ? validWallets.find(
          (wallet) =>
            wallet.currency.code.toUpperCase() ===
            requestedAsset
        )
      : undefined;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-white">
          Receive Crypto
        </h1>

        <p className="mt-2 text-slate-400">
          Receive digital assets into your
          ColdWallet account.
        </p>
      </section>

      <ReceiveWallet
        wallets={validWallets}
        initialWalletId={
          initialWallet?.id
        }
      />
    </div>
  );
}