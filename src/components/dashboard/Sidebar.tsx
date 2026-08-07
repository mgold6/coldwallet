"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Coins,
  BookOpen,
  ShieldCheck,
  Settings,
  Bell,
} from "lucide-react";


const menuItems = [

  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    name: "Portfolio",
    href: "/dashboard/portfolio",
    icon: Wallet,
  },

  {
    name: "Markets",
    href: "/dashboard/markets",
    icon: LineChart,
  },

  {
    name: "Earn",
    href: "/dashboard/earn",
    icon: Coins,
  },

  {
    name: "Learning",
    href: "/dashboard/learning",
    icon: BookOpen,
  },

  {
    name: "Security",
    href: "/dashboard/security",
    icon: ShieldCheck,
  },

  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },

  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },

];



export default function Sidebar() {

  return (

    <aside
      className="
        flex
        min-h-screen
        w-72
        flex-col
        border-r
        border-gray-800
        bg-slate-950
      "
    >


      <div className="p-6">


        <h1 className="text-2xl font-bold text-white">
          ColdWallet
        </h1>


        <p className="mt-2 text-sm text-gray-400">
          Secure Digital Asset Platform
        </p>


      </div>





      <nav className="flex-1 space-y-2 p-6">


        {menuItems.map((item) => {

          const Icon = item.icon;


          return (

            <Link

              key={item.name}

              href={item.href}

              className="
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-gray-300
                transition-all
                hover:bg-cyan-500/10
                hover:text-cyan-400
              "

            >

              <Icon size={20}/>


              <span>
                {item.name}
              </span>


            </Link>

          );

        })}


      </nav>





      <div className="border-t border-gray-800 p-6">


        <div className="rounded-xl bg-cyan-500/10 p-4">


          <h3 className="font-semibold text-white">
            Security Status
          </h3>


         <p className="mt-2 text-sm text-gray-400">
  Two-factor authentication, login monitoring, and wallet protection enabled.
</p>



          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-700">

            <div className="h-full w-[100%] rounded-full bg-cyan-400"></div>

          </div>



          <p className="mt-2 text-sm text-cyan-400">
            100% Secure
          </p>


        </div>


      </div>


    </aside>

  );

}