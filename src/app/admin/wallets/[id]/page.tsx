import { notFound } from "next/navigation";
import { adminWalletService } from "@/server/services/admin-wallet.service";

interface WalletPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function WalletDetailsPage({
  params,
}: WalletPageProps) {
  const { id } = await params;

  const wallet = await adminWalletService.getWalletById(id);

  if (!wallet) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Wallet Details
        </h1>

        <p className="mt-2 text-slate-400">
          Complete information for this wallet.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Wallet Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">
                Address
              </p>

              <p className="font-mono break-all">
                {wallet.address}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Balance
              </p>

              <p className="text-2xl font-bold">
                {wallet.balance.toString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Currency
              </p>

              <p>{wallet.currency.code}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Network
              </p>

              <p>{wallet.network?.name ?? "-"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Status
              </p>

              <p>{wallet.status}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Owner
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">
                Name
              </p>

              <p>
                {wallet.portfolio.user.name ??
                  wallet.portfolio.user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Email
              </p>

              <p>{wallet.portfolio.user.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Portfolio
              </p>

              <p>{wallet.portfolio.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}