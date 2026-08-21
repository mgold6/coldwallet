"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^\d{6}$/.test(normalizedCode)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          code: normalizedCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to verify your email address."
        );
        return;
      }

      if (data.alreadyVerified) {
        setError(
          "This email address is already verified. Please sign in."
        );

        setTimeout(() => {
          router.replace("/login");
        }, 1200);

        return;
      }

      if (!data.loginToken) {
        setError(
          "Your email was verified, but automatic sign-in could not be started. Please sign in manually."
        );

        setTimeout(() => {
          router.replace("/login");
        }, 1800);

        return;
      }

      setCode("");

      setSuccess(
        "Email verified successfully. Signing you into ColdWallet..."
      );

      const loginResult = await signIn("credentials", {
        verificationToken: data.loginToken,
        redirect: false,
      });

      if (!loginResult?.ok) {
        setError(
          "Your email was verified, but automatic sign-in failed. Please sign in manually."
        );

        setTimeout(() => {
          router.replace("/login");
        }, 1800);

        return;
      }

      const sessionResponse = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      const session = await sessionResponse.json();

      router.replace(
        session?.user?.role === "ADMIN"
          ? "/admin"
          : "/dashboard"
      );

      router.refresh();
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setResending(true);

    try {
      const response = await fetch(
        "/api/verify-email/resend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to resend the verification code."
        );

        return;
      }

      setSuccess(
        "A new ColdWallet verification code has been sent to your email."
      );
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] lg:grid-cols-2">
          <div className="flex flex-col justify-center bg-gradient-to-br from-blue-600 to-cyan-500 p-8 sm:p-10 lg:p-14">
            <div className="text-5xl text-white">
              ✉️
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Verify Your
              <br />
              Email
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-blue-100">
              Verify your email address to secure your
              ColdWallet account and continue directly to
              your profile.
            </p>

            <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5">
              <p className="text-sm leading-6 text-blue-50">
                We sent a six-digit verification code to
                your email address. The code is valid for 10
                minutes.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-14">
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-white">
                Verify Email
              </h2>

              <p className="mt-3 text-gray-400">
                Enter the 6-digit verification code we sent
                to your email address.
              </p>
            </div>

            <form
              onSubmit={handleVerify}
              className="space-y-6"
            >
              <div>
                <label className="mb-2 block text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-300">
                  Verification Code
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="000000"
                  required
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-center text-3xl tracking-[0.45em] text-white outline-none transition focus:border-cyan-400"
                />

                <p className="mt-2 text-center text-xs text-gray-500">
                  Enter the 6-digit code from ColdWallet.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm leading-6 text-green-400">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || resending}
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Verifying..."
                  : "Verify Email"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || loading}
                className="text-cyan-400 transition hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resending
                  ? "Sending..."
                  : "Resend Verification Code"}
              </button>
            </div>

            <p className="mt-8 text-center text-gray-400">
              Already verified?

              <Link
                href="/login"
                className="ml-2 text-cyan-400 transition hover:text-cyan-300"
              >
                Login
              </Link>
            </p>

            <Link
              href="/"
              className="mt-6 block text-center text-gray-500 transition hover:text-white"
            >
              ← Back to Home
            </Link>

            <div className="mt-8 rounded-xl border border-gray-800 bg-[#0B0F19] p-4">
              <p className="text-xs leading-5 text-gray-500">
                <span className="font-semibold text-gray-400">
                  Security notice:
                </span>{" "}
                ColdWallet will never ask you to share your
                password, private keys, recovery phrase, or
                verification code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function VerifyEmailLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617] px-4">
      <div className="rounded-2xl border border-gray-800 bg-[#111827] px-8 py-6 text-center">
        <p className="text-sm text-gray-400">
          Loading email verification...
        </p>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
