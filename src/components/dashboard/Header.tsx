"use client";

import Link from "next/link";

import {
  Search,
  Bell,
  CircleUserRound,
} from "lucide-react";


export default function Header() {

  return (

    <header
      className="
        flex
        items-center
        justify-between
      "
    >

      <div>

        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>


        <p className="mt-2 text-gray-400">
          Welcome back. Here's an overview of your digital assets.
        </p>

      </div>





      <div className="flex items-center gap-4">


        <div className="relative">

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

            className="
              w-72
              rounded-xl
              border
              border-gray-700
              bg-[#111827]
              py-3
              pl-10
              pr-4
              text-white
              focus:outline-none
              focus:border-cyan-400
            "

          />

        </div>







        <Link

          href="/dashboard/notifications"

          className="
            rounded-xl
            bg-[#111827]
            p-3
            transition
            hover:bg-cyan-500/10
          "

        >

          <Bell size={20} />

        </Link>








        <Link

          href="/dashboard/settings"

          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-4
            py-3
            font-semibold
            text-black
          "

        >

          <CircleUserRound size={20} />

          My Account

        </Link>


      </div>


    </header>

  );

}