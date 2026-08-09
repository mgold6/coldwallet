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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      remember: remember ? "true" : "false",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    if (result?.ok) {

      const sessionResponse =
        await fetch("/api/auth/session");

      const session =
        await sessionResponse.json();


      if (session?.user?.role === "ADMIN") {

        router.push(
          "/dashboard/admin"
        );

      } else {

        router.push(
          "/dashboard"
        );

      }


      router.refresh();

    }
  }


  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-800 bg-[#111827] lg:grid-cols-2">


        <div className="flex flex-col justify-center bg-gradient-to-br from-blue-600 to-cyan-500 p-10 lg:p-14">

          <div className="mb-10">
            <div className="mb-8 text-white text-5xl">
              🛡️
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight">
              Welcome Back to
              <br />
              ColdWallet
            </h1>


            <p className="mt-6 text-lg leading-8 text-blue-100">
              Securely manage your digital assets,
              monitor live cryptocurrency markets,
              organize your portfolio, and continue learning.
            </p>

          </div>

        </div>



        <div className="p-10 lg:p-14">

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

              <label className="block mb-2 text-gray-300">
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
                className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
              />

            </div>




            <div>

              <label className="block mb-2 text-gray-300">
                Password
              </label>


              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-gray-700 bg-[#0B0F19] px-4 py-4 text-white outline-none focus:border-cyan-400"
              />

            </div>




            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-gray-400">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(e.target.checked)
                  }
                />

                Remember me

              </label>



              <Link
                href="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Forgot Password?
              </Link>

            </div>





            {error && (

              <p className="text-sm text-red-400">
                {error}
              </p>

            )}






            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >

              {
                loading
                  ? "Signing In..."
                  : "Login"
              }

            </button>


          </form>





          <p className="mt-8 text-center text-gray-400">

            Don't have an account?


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


        </div>

      </div>

    </main>
  );
}