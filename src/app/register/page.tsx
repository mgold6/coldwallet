"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!agree) {
      setError("You must accept the Terms of Service.");
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresVerification && data.email) {
          router.push(
            "/verify-email?email=" +
              encodeURIComponent(data.email)
          );

          return;
        }

        setError(
          data.message || "Registration failed."
        );

        return;
      }

      if (data.requiresVerification) {
        router.push(
          "/verify-email?email=" +
            encodeURIComponent(
              data.email || normalizedEmail
            )
        );

        return;
      }

      setError(
        "Account created, but verification could not be started."
      );
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] lg:grid-cols-2">
          <div className="hidden flex-col justify-center bg-gradient-to-br from-blue-600 to-cyan-500 p-10 lg:flex lg:p-14">
            <div className="mb-10">
              <ShieldCheck
                size={64}
                className="mb-8 text-white"
              />

              <h1 className="text-5xl font-bold leading-tight text-white">
                Join
                <br />
                ColdWallet
              </h1>

              <p className="mt-6 text-lg leading-8 text-blue-100">
                Create your account and securely organize
                your digital assets, track live
                cryptocurrency markets, learn blockchain
                security, and prepare your investment
                portfolio.
              </p>
            </div>
          </div>

          <div className="p-10 lg:p-14">
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-white">
                Create Account
              </h2>

              <p className="mt-3 text-gray-400">
                Get started with ColdWallet today.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-300">
                    First Name
                  </label>

                  <input
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    type="text"
                    placeholder="John"
                    required
                    autoComplete="given-name"
                    className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-gray-300">
                    Last Name
                  </label>

                  <input
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    type="text"
                    placeholder="Doe"
                    required
                    autoComplete="family-name"
                    className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-gray-300">
                  Email Address
                </label>

                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  type="email"
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
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-gray-300">
                  Confirm Password
                </label>

                <input
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-gray-400">
                <input
                  checked={agree}
                  onChange={(e) =>
                    setAgree(e.target.checked)
                  }
                  type="checkbox"
                />

                <span>
                  I agree to the Terms of Service and
                  Privacy Policy.
                </span>
              </label>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-400">
              Already have an account?

              <Link
                href="/login"
                className="ml-2 text-cyan-400 hover:text-cyan-300"
              >
                Login
              </Link>
            </p>

            <Link
              href="/"
              className="mt-6 block text-center text-cyan-400 hover:text-cyan-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}