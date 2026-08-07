"use client";

import { useState } from "react";


export default function CopyAddressButton({
  address,
}: {
  address: string;
}) {

  const [copied, setCopied] = useState(false);


  async function copyAddress() {

    await navigator.clipboard.writeText(address);

    setCopied(true);


    setTimeout(() => {
      setCopied(false);
    }, 2000);

  }



  return (

    <button
      onClick={copyAddress}
      className="
        mt-5
        w-full
        rounded-xl
        bg-cyan-500
        py-3
        font-semibold
        text-black
        transition
        hover:bg-cyan-400
      "
    >

      {copied ? "Copied!" : "Copy Address"}

    </button>

  );
}