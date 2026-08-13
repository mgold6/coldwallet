import { notFound } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";

import prisma from "@/lib/prisma";

import WalletFinancialOperations from "./components/WalletFinancialOperations";
import WalletTabs from "./components/WalletTabs";
import WalletDeposits from "./components/WalletDeposits";
import WalletWithdrawals from "./components/WalletWithdrawals";
import WalletTransactions from "./components/WalletTransactions";

interface WalletPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WalletPage({
  params,
}: WalletPageProps) {
  const { id } = await params;

  const wallet =
    await prisma.wallet.findUnique({
      where: {
        id,
      },

      include: {
        currency: true,

        network: true,

        deposits: {
          orderBy: {
            createdAt: "desc",
          },
        },

        transactions: {
  orderBy: {
    createdAt: "desc",
  },
},

withdrawals: {
  orderBy: {
    createdAt: "desc",
  },
},

portfolio: {
          include: {
            user: true,
          },
        },
      },
    });

  if (!wallet) {
    notFound();
  }

  const formatBalance = (
    value: Decimal
  ) => {
    return Number(value)
      .toLocaleString(
        undefined,
        {
          minimumFractionDigits: 6,
          maximumFractionDigits: 8,
        }
      );
  };

  const overview = (
    <div className="space-y-6">
      <div
        className="
          rounded-xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >
        <h2 className="text-xl font-semibold text-white">
          Wallet Overview
        </h2>

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
          "
        >
          <div>
            <p className="text-sm text-slate-400">
              Wallet Address
            </p>

            <p
              className="
                mt-2
                break-all
                rounded-lg
                bg-slate-800
                p-3
                text-white
              "
            >
              {wallet.address}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Currency
            </p>

            <p className="mt-2 text-white">
              {wallet.currency.code}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Available Balance
            </p>

            <p className="mt-2 text-white">
              {formatBalance(
                wallet.availableBalance
              )}{" "}
              {wallet.currency.code}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Network
            </p>

            <p className="mt-2 text-white">
              {wallet.network?.name ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-8">
      <div
        className="
          grid
          grid-cols-1
          gap-6
          lg:grid-cols-2
        "
      >
        <section
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
          "
        >
          <h1 className="text-2xl font-bold text-white">
            Wallet Details
          </h1>

          <div className="mt-6">
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
              {formatBalance(
                wallet.balance
              )}{" "}
              {wallet.currency.code}
            </p>
          </div>

          <div
            className="
              mt-6
              rounded-xl
              bg-slate-950
              p-5
            "
          >
            <h2 className="mb-5 font-semibold text-white">
              Balance Breakdown
            </h2>

            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
              "
            >
              <Balance
                title="Available Balance"
                value={
                  wallet.availableBalance
                }
                currency={
                  wallet.currency.code
                }
                format={formatBalance}
              />

              <Balance
                title="Blockchain Balance"
                value={
                  wallet.blockchainBalance
                }
                currency={
                  wallet.currency.code
                }
                format={formatBalance}
              />

              <Balance
                title="Internal Balance"
                value={
                  wallet.internalBalance
                }
                currency={
                  wallet.currency.code
                }
                format={formatBalance}
              />

              <Balance
                title="Locked Balance"
                value={
                  wallet.lockedBalance
                }
                currency={
                  wallet.currency.code
                }
                format={formatBalance}
              />
            </div>
          </div>
        </section>

        <section
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
          "
        >
          <h2 className="text-xl font-semibold text-white">
            User Information
          </h2>

          <div className="mt-6 space-y-5">
            <Info
              title="Email"
              value={
                wallet.portfolio.user.email
              }
            />

            <Info
              title="Portfolio"
              value="Main Portfolio"
            />

            <Info
              title="Status"
              value={
                wallet.portfolio.user.status
              }
            />

            <Info
              title="Role"
              value={
                wallet.portfolio.user.role
              }
            />
          </div>
        </section>
      </div>

      <WalletFinancialOperations
        walletId={wallet.id}
      />

      <WalletTabs
        overview={overview}
        deposits={
          <WalletDeposits
            wallet={wallet}
          />
        }
        withdrawals={
          <WalletWithdrawals
            wallet={wallet}
          />
        }
        transactions={
          <WalletTransactions
            wallet={wallet}
          />
        }
      />
    </div>
  );
}

function Balance({
  title,
  value,
  currency,
  format,
}: {
  title: string;
  value: Decimal;
  currency: string;
  format: (value: Decimal) => string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-1 break-all text-white">
        {format(value)}{" "}
        {currency}
      </p>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-white">
        {value}
      </p>
    </div>
  );
}