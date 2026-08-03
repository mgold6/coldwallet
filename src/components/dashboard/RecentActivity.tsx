export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Recent Activity
      </h2>

      <div className="space-y-4">

        <div className="rounded-xl bg-[#0B0F19] p-4">
          <p className="font-medium text-white">
            Welcome to ColdWallet
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Your account has been created successfully.
          </p>
        </div>

        <div className="rounded-xl bg-[#0B0F19] p-4">
          <p className="font-medium text-white">
            Portfolio Ready
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Add your first digital asset to begin tracking.
          </p>
        </div>

        <div className="rounded-xl bg-[#0B0F19] p-4">
          <p className="font-medium text-white">
            Security Status
          </p>

          <p className="mt-1 text-sm text-green-400">
            No security alerts.
          </p>
        </div>

      </div>
    </div>
  );
}