"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";


interface SettingsFormProps {

  withdrawalMessage: string;

}


export default function SettingsForm({

  withdrawalMessage,

}: SettingsFormProps) {


  const router = useRouter();


  const [message, setMessage] =
    useState(withdrawalMessage);


  const [status, setStatus] =
    useState("");



  async function handleSave() {


    setStatus("Saving...");


    const response =
      await fetch(
        "/api/admin/settings",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },


          body: JSON.stringify({

            key:
              "withdrawal_insufficient_balance",

            value:
              message,

            description:
              "Message shown when a withdrawal cannot be completed.",

          }),

        }
      );



    if (response.ok) {

      setStatus(
        "Saved successfully."
      );


      router.refresh();


    } else {

      setStatus(
        "Unable to save settings."
      );

    }


  }



  return (

    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-6
        space-y-5
      "
    >

      <h2 className="text-xl font-bold text-white">
        Withdrawal Message
      </h2>


      <textarea

        value={message}

        onChange={(e)=>
          setMessage(
            e.target.value
          )
        }

        rows={5}

        className="
          w-full
          rounded-xl
          bg-slate-950
          p-4
          text-white
        "

      />
            <button

        onClick={handleSave}

        className="
          rounded-xl
          bg-cyan-400
          px-6
          py-3
          font-semibold
          text-slate-900
        "

      >

        Save Settings

      </button>



      {
        status && (

          <p className="text-sm text-cyan-400">

            {status}

          </p>

        )
      }


    </div>

  );

}