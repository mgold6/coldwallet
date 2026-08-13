"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const [requiresTwoFactor, setRequiresTwoFactor] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    /*
     * STEP 2:
     * If 2FA is already required, verify the
     * authenticator code through NextAuth.
     */
    if (requiresTwoFactor) {
      if (!/^\d{6}$/.test(twoFactorCode)) {
        setError(
          "Please enter the 6-digit authenticator code."
        );
        return;
      }

      setLoading(true);

      try {
        const result = await signIn(
          "credentials",
          {
            email: normalizedEmail,
            password,
            twoFactorCode,
            remember: remember
              ? "true"
              : "false",
            redirect: false,
          }
        );

        if (result?.error) {
          setError(
            "The authenticator code is incorrect or has expired. Please try again."
          );
          setTwoFactorCode("");
          return;
        }

        if (result?.ok) {
          const sessionResponse =
            await fetch(
              "/api/auth/session"
            );

          const session =
            await sessionResponse.json();

          if (
            session?.user?.role ===
            "ADMIN"
          ) {
            router.replace(
              "/dashboard/admin"
            );
          } else {
            router.replace(
              "/dashboard"
            );
          }

          router.refresh();

          return;
        }

        setError(
          "Unable to complete sign in. Please try again."
        );
      } catch {
        setError(
          "Unable to connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    /*
     * STEP 1:
     * Verify email/password and determine whether
     * this account requires 2FA.
     *
     * This does NOT create a session.
     */
    setLoading(true);

    try {
      const statusResponse =
        await fetch(
          "/api/auth/login-check",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email: normalizedEmail,
              password,
            }),
          }
        );

      const statusData =
        await statusResponse.json();

      if (!statusResponse.ok) {
        setError(
          statusData.message ||
            "Invalid email or password."
        );
        return;
      }

      /*
       * Account exists but email has not
       * been verified.
       */
      if (
        statusData.requiresVerification
      ) {
        router.push(
          `/verify-email?email=${encodeURIComponent(
            normalizedEmail
          )}`
        );

        return;
      }

      /*
       * 2FA is enabled.
       * Do NOT sign in yet.
       */
      if (
        statusData.requiresTwoFactor
      ) {
        setRequiresTwoFactor(true);
        setTwoFactorCode("");
        setError("");
        return;
      }

      /*
       * No 2FA.
       * Complete normal sign in.
       */
      const result = await signIn(
        "credentials",
        {
          email: normalizedEmail,
          password,
          remember: remember
            ? "true"
            : "false",
          redirect: false,
        }
      );

      if (result?.error) {
        setError(
          "Unable to sign in. Please try again."
        );
        return;
      }

      if (result?.ok) {
        const sessionResponse =
          await fetch(
            "/api/auth/session"
          );

        const session =
          await sessionResponse.json();

        if (
          session?.user?.role ===
          "ADMIN"
        ) {
          router.replace(
            "/dashboard/admin"
          );
        } else {
          router.replace(
            "/dashboard"
          );
        }

        router.refresh();

        return;
      }

      setError(
        "Unable to sign in. Please try again."
      );
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function goBackToPassword() {
    setRequiresTwoFactor(false);
    setTwoFactorCode("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] shadow-2xl lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-8 sm:p-10 lg:p-14">
            <div className="text-5xl">
              🛡️
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Welcome Back to
              <br />
              ColdWallet
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Securely manage your digital
              assets, monitor live cryptocurrency
              markets, organize your portfolio,
              and continue learning.
            </p>

            {requiresTwoFactor && (
              <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5">
                <p className="text-sm leading-6 text-blue-50">
                  Your account has two-factor
                  authentication enabled. Enter
                  the current 6-digit code from
                  your authenticator app to
                  continue.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 sm:p-10 lg:p-14">
            {!requiresTwoFactor ? (
              <>
                <div className="mb-10">
                  <h2 className="text-4xl font-bold text-white">
                    Login
                  </h2>

                  <p className="mt-3 text-gray-400">
                    Access your ColdWallet account.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
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
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="name@example.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-gray-300">
                      Password
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) =>
                          setRemember(
                            e.target.checked
                          )
                        }
                      />

                      Remember me
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Checking..."
                      : "Login"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl">
                    🔐
                  </div>

                  <h2 className="text-3xl font-bold text-white sm:text-4xl">
                    Two-Factor Authentication
                  </h2>

                  <p className="mt-3 leading-6 text-gray-400">
                    Enter the 6-digit code from
                    your authenticator app to
                    complete your ColdWallet login.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="mb-2 block text-gray-300">
                      Authenticator Code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(e) =>
                        setTwoFactorCode(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      placeholder="000000"
                      autoFocus
                      required
                      className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-5 text-center text-3xl tracking-[0.45em] text-white outline-none transition focus:border-cyan-400"
                    />

                    <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                      Open your authenticator app
                      and enter the current
                      6-digit ColdWallet code.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      twoFactorCode.length !== 6
                    }
                    className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify & Login"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={goBackToPassword}
                  disabled={loading}
                  className="mt-6 w-full text-center text-sm text-gray-500 transition hover:text-white disabled:opacity-50"
                >
                  ← Back to password
                </button>

                <div className="mt-8 rounded-xl border border-gray-800 bg-[#0B0F19] p-4">
                  <p className="text-xs leading-5 text-gray-500">
                    <span className="font-semibold text-gray-400">
                      Security notice:
                    </span>{" "}
                    ColdWallet will never ask you
                    to share your password, private
                    keys, recovery phrase, or
                    authenticator code.
                  </p>
                </div>
              </>
            )}

            {!requiresTwoFactor && (
              <>
                <p className="mt-8 text-center text-gray-400">
                  Don&apos;t have an account?

                  <Link
                    href="/register"
                    className="ml-2 text-cyan-400 hover:text-cyan-300"
                  >
                    Create One
                  </Link>
                </p>

                <Link
                  href="/"
                  className="mt-6 block text-center text-gray-500 hover:text-white"
                >
                  ← Back to Home
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}