interface WalletOwnerProps {
  wallet: {
    portfolio: {
      name: string;
      user: {
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string;
        status: string;
        role: string;
      };
    };
  };
}

export default function WalletOwner({
  wallet,
}: WalletOwnerProps) {
  const fullName =
    wallet.portfolio.user.name ??
    (
      `${wallet.portfolio.user.firstName ?? ""} ${
        wallet.portfolio.user.lastName ?? ""
      }`.trim() || "Not provided"
    );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Owner Information
      </h2>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-400">
            Full Name
          </p>

          <p className="mt-1 text-lg">
            {fullName}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Email
          </p>

          <p className="mt-1">
            {wallet.portfolio.user.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Portfolio
          </p>

          <p className="mt-1">
            {wallet.portfolio.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400">
              User Status
            </p>

            <p className="mt-1">
              {wallet.portfolio.user.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Role
            </p>

            <p className="mt-1">
              {wallet.portfolio.user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
