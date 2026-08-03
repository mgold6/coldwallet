"use client";

import { Search, Bell, CircleUserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Welcome back. Here's an overview of your digital assets.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-[#111827] border border-gray-700 rounded-xl py-3 pl-10 pr-4 w-72 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button className="bg-[#111827] p-3 rounded-xl hover:bg-cyan-500/10 transition">
          <Bell size={20} />
        </button>

        <button className="bg-cyan-500 text-black font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
          <CircleUserRound size={20} />
          My Account
        </button>
      </div>
    </header>
  );
}