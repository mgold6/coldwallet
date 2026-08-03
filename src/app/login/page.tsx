import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#111827] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
          <ShieldCheck className="w-16 h-16 text-white mb-8" />

          <h1 className="text-5xl font-bold text-white leading-tight">
            Welcome Back to
            <br />
            ColdWallet
          </h1>

          <p className="text-blue-100 mt-6 text-lg leading-8">
            Securely manage your digital assets, monitor live cryptocurrency
            markets, organize your portfolio, and continue learning with one
            professional platform.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white">100%</h2>
              <p className="text-blue-100">Security Focused</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">24/7</h2>
              <p className="text-blue-100">Market Updates</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 lg:p-14">

          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white">
              Login
            </h2>

            <p className="text-gray-400 mt-3">
              Access your ColdWallet account.
            </p>
          </div>

          <form className="space-y-6">

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

            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-4 font-semibold text-lg"
            >
              Login
            </button>

          </form>

          <p className="mt-8 text-center text-gray-400">

            Don't have an account?

            <Link
              href="/register"
              className="text-cyan-400 ml-2 hover:text-cyan-300"
            >
              Create One
            </Link>

          </p>

          <Link
            href="/"
            className="block mt-6 text-center text-gray-500 hover:text-white"
          >
            ← Back to Home
          </Link>

        </div>

      </div>
    </main>
  );
}