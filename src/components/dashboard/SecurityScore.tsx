export default function SecurityScore() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111827] p-6">

      <h2 className="mb-6 text-2xl font-semibold text-white">
        Security Score
      </h2>

      <div className="flex items-center justify-center">

        <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-green-500 text-5xl font-bold text-green-400">
          100%
        </div>

      </div>

      <div className="mt-8 space-y-3 text-gray-300">

        <p>✅ Strong Password</p>

        <p>✅ Account Protected</p>

        <p>✅ No Security Alerts</p>

        <p>⚠ Enable Two-Factor Authentication</p>

      </div>

    </div>
  );
}