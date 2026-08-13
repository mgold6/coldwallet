import Link from "next/link";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-gray-800 bg-[#111827] p-10 shadow-2xl">

        <div className="flex justify-center mb-8">
          <div className="rounded-full bg-cyan-500/10 p-5">
            <KeyRound className="h-10 w-10 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-center text-4xl font-bold text-white">
          Forgot Password?
        </h1>

        <p className="mt-4 text-center text-gray-400">
          Enter your email address and we&apos;ll send you instructions to reset your
          password.
        </p>

        <form className="mt-10 space-y-6">

          <div>
            <label className="mb-2 block text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <button
            className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            Send Reset Link
          </button>

        </form>

        <div className="mt-10 text-center">

          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Login
          </Link>

        </div>

      </div>
    </main>
  );
}