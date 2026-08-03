import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-[#111827] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">

          <ShieldCheck className="w-16 h-16 text-white mb-8" />

          <h1 className="text-5xl font-bold text-white leading-tight">
            Join
            <br />
            ColdWallet
          </h1>

          <p className="text-blue-100 mt-6 text-lg leading-8">
            Create your free account and start organizing your digital assets,
            tracking live cryptocurrency markets, learning blockchain security,
            and preparing your investment portfolio.
          </p>

          <div className="mt-12 space-y-6">

            <div>
              <h2 className="text-3xl font-bold text-white">Live Markets</h2>
              <p className="text-blue-100">
                Real-time cryptocurrency prices.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">Portfolio</h2>
              <p className="text-blue-100">
                Track your digital assets securely.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">Learning</h2>
              <p className="text-blue-100">
                Improve your blockchain knowledge.
              </p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="p-10 lg:p-14">

          <h2 className="text-4xl font-bold text-white">
            Create Account
          </h2>

          <p className="text-gray-400 mt-3 mb-10">
            Get started with ColdWallet today.
          </p>

          <form className="space-y-5">

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-gray-300 mb-2">
                  First Name
                </label>

                <input
                  type="text"
                  placeholder="John"
                  className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-cyan-400 outline-none"
                />
              </div>

            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <label className="flex items-center gap-3 text-gray-400 text-sm">

              <input type="checkbox" />

              I agree to the Terms of Service and Privacy Policy.

            </label>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-4 font-semibold text-lg text-white"
            >
              Create Account
            </button>

          </form>

          <p className="mt-8 text-center text-gray-400">

            Already have an account?

            <Link
              href="/login"
              className="text-cyan-400 ml-2 hover:text-cyan-300"
            >
              Login
            </Link>

          </p>

          <Link
            href="/"
            className="block mt-6 text-center text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Home
          </Link>

        </div>

      </div>
    </main>
  );
}