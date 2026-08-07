"use client";

import { signOut } from "next-auth/react";


export default function LogoutButton() {


  async function handleLogout() {

    await signOut({
      callbackUrl: "/login",
    });

  }





  return (

    <button

      onClick={handleLogout}

      className="
        rounded-xl
        bg-red-500/20
        px-5
        py-3
        font-semibold
        text-red-400
        transition
        hover:bg-red-500/30
      "

    >

      Sign Out

    </button>

  );

}