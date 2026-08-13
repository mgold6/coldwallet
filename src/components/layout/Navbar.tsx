"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 bg-[#070b17]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">

        <Link
          href="/"
          className="shrink-0 text-xl font-bold text-white transition hover:text-blue-400 sm:text-2xl"
        >
          ColdWallet
        </Link>


        <div className="flex items-center gap-2 sm:gap-4">

          {pathname !== "/contact" && (
            <Link
              href="/contact"
              className="hidden text-sm text-gray-300 transition hover:text-blue-400 sm:block"
            >
              Contact
            </Link>
          )}


          <Link
            href="/login"
            className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-white transition hover:bg-gray-900 sm:px-5"
          >
            Login
          </Link>


          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 sm:px-5"
          >
            Sign Up
          </Link>

        </div>

      </div>
    </nav>
  );
}