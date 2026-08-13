"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ShieldCheck,
  Wallet,
  Mail,
  CheckCircle,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubscribe() {
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("Thank you for subscribing to ColdWallet updates.");
    setEmail("");
  }

  return (
    <footer className="border-t border-white/10 bg-[#050816] py-12 sm:py-16">

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="grid gap-10 sm:gap-12 lg:grid-cols-5">


          {/* Brand */}

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/20 p-3">
                <Wallet className="h-7 w-7 text-blue-400" />
              </div>

              <h2 className="text-xl font-bold text-white sm:text-2xl">
                ColdWallet
              </h2>

            </div>


            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:mt-6 sm:text-base">
              Securely organize digital assets, monitor portfolios,
              and build confidence through security-focused tools
              and blockchain education.
            </p>


            <div className="mt-5 flex items-start gap-3 text-sm text-slate-400 sm:mt-6 sm:items-center sm:text-base">

              <ShieldCheck className="h-5 w-5 text-blue-400" />

              <span>
                Security-focused digital asset management
              </span>

            </div>


            <div className="mt-5 flex items-center gap-2 text-sm text-green-400">

              <CheckCircle className="h-4 w-4" />

              All Systems Operational

            </div>

          </div>



          {/* Product */}

          <div>

            <h3 className="font-semibold text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3 text-slate-400">

              <li>
                <Link href="/dashboard" className="hover:text-blue-400">
                  Dashboard
                </Link>
              </li>

              <li>
                Portfolio Tracking
              </li>

              <li>
                Wallet Management
              </li>

              <li>
                Security Tools
              </li>

            </ul>

          </div>



          {/* Resources */}

          <div>

            <h3 className="font-semibold text-white">
              Resources
            </h3>


            <ul className="mt-5 space-y-3 text-slate-400">

              <li>
                <Link href="/learn" className="hover:text-blue-400">
                  Education Center
                </Link>
              </li>

              <li>
                Blockchain Guides
              </li>

              <li>
                Market Insights
              </li>

              <li>
                Security Practices
              </li>

            </ul>

          </div>



          {/* Company */}

          <div>

            <h3 className="font-semibold text-white">
              Company
            </h3>


            <ul className="mt-5 space-y-3 text-slate-400">

              <li>
                <Link href="/about" className="hover:text-blue-400">
                  About ColdWallet
                </Link>
              </li>


              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  Contact
                </Link>
              </li>


              <li>
                Careers
              </li>


              <li>
                Security
              </li>

            </ul>

          </div>



        </div>



        {/* Newsletter */}

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-5 sm:mt-16 sm:p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">


            <div>

              <h3 className="text-lg font-semibold text-white sm:text-xl">
                Stay Updated
              </h3>


              <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                Receive digital asset security updates,
                blockchain insights, and ColdWallet news.
              </p>

            </div>



            <div className="w-full max-w-md">

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">

                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 sm:rounded-l-xl sm:rounded-r-none">

                  <Mail className="h-5 w-5 text-slate-400" />

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent py-3 text-white outline-none placeholder:text-slate-500"
                  />

                </div>


                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 sm:rounded-l-none sm:rounded-r-xl"
                >
                  Subscribe
                </button>

              </div>


              {message && (
                <p className="mt-3 text-sm text-blue-400">
                  {message}
                </p>
              )}

            </div>


          </div>

        </div>



        {/* Supported Assets */}

        <div className="mt-8 border-t border-white/10 pt-6 sm:mt-10 sm:pt-8">

          <p className="text-sm text-slate-400">
            Supported Assets
          </p>


          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
            BTC • ETH • SOL • XRP • BNB • AVAX • DOGE • LTC • USDT
          </p>

        </div>



        {/* Bottom */}

        <div className="mt-10 border-t border-white/10 pt-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">


            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} ColdWallet. All rights reserved.
            </p>



            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">

              <Link href="/privacy" className="hover:text-blue-400">
                Privacy Policy
              </Link>


              <Link href="/terms" className="hover:text-blue-400">
                Terms of Service
              </Link>


              <Link href="/cookies" className="hover:text-blue-400">
                Cookie Policy
              </Link>

            </div>


          </div>

        </div>


      </div>

    </footer>
  );
}