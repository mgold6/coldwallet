"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Search,
  Bell,
  CircleUserRound,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const isMainDashboard =
    pathname === "/dashboard";

  return (
    <header
      className="
        flex
        min-w-0
        items-center
        justify-between
        gap-3
        px-4
        py-4
        sm:px-6
        lg:px-8
      "
    >
      <div className="min-w-0 flex-1 pl-14 md:pl-0">
        {isMainDashboard && (
          <>
            <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 hidden text-gray-400 sm:block">
              Welcome back. Here&apos;s an overview of your digital
              assets.
            </p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="
              h-11
              w-56
              rounded-xl
              border
              border-gray-700
              bg-[#111827]
              py-2
              pl-10
              pr-4
              text-base
              text-white
              placeholder:text-gray-500
              focus:border-cyan-400
              focus:outline-none
              sm:w-64
              lg:w-72
            "
          />
        </div>

        <Link
          href="/dashboard/notifications"
          aria-label="Notifications"
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#111827]
            text-gray-200
            transition
            hover:bg-cyan-500/10
            hover:text-cyan-400
          "
        >
          <Bell size={20} />
        </Link>

        <Link
          href="/dashboard/settings"
          className="
            flex
            h-11
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-3
            font-semibold
            text-black
            transition
            hover:bg-cyan-400
            sm:px-4
          "
        >
          <CircleUserRound size={20} />

          <span className="hidden sm:inline">
            My Account
          </span>
        </Link>
      </div>
    </header>
  );
}
