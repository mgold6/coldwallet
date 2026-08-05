interface WalletBusinessInfoProps {
  wallet: any;
}

function formatDate(date?: Date | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString();
}

export default function WalletBusinessInfo({
  wallet,
}: WalletBusinessInfoProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Business Information
      </h2>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-400">
            Assigned Date
          </p>

          <p className="mt-1">
            {formatDate(wallet.assignedAt)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Created
          </p>

          <p className="mt-1">
            {formatDate(wallet.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Last Updated
          </p>

          <p className="mt-1">
            {formatDate(wallet.updatedAt)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Notes
          </p>

          <div className="mt-2 rounded-lg border border-slate-800 bg-slate-950 p-4">
            {wallet.notes ? (
              <p className="whitespace-pre-wrap">
                {wallet.notes}
              </p>
            ) : (
              <p className="italic text-slate-500">
                No administrative notes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}