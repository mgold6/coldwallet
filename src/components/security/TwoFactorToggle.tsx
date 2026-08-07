"use client";

import { useState } from "react";


interface TwoFactorToggleProps {

  enabled: boolean;

}



export default function TwoFactorToggle({
  enabled,
}: TwoFactorToggleProps) {


  const [active, setActive] =
    useState(enabled);


  const [loading, setLoading] =
    useState(false);


  const [message, setMessage] =
    useState("");





  async function toggleTwoFactor() {


    setLoading(true);

    setMessage("");



    try {


      const response =
        await fetch(
          "/api/security/2fa",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },


            body: JSON.stringify({

              enabled: !active,

            }),

          }
        );




      const data =
        await response.json();




      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to update 2FA."
        );

      }





      setActive(!active);


      setMessage(
        !active
          ? "Two-factor authentication enabled."
          : "Two-factor authentication disabled."
      );



    } catch(error:any) {


      setMessage(
        error.message
      );


    } finally {

      setLoading(false);

    }


  }





  return (

    <div className="space-y-4">


      <div
        className="
          flex
          items-center
          justify-between
          rounded-xl
          bg-slate-950
          p-4
        "
      >


        <div>

          <p className="font-semibold text-white">
            Two-Factor Authentication
          </p>


          <p className="text-sm text-slate-400">
            Add an extra layer of protection to your account.
          </p>

        </div>




        <button

          onClick={toggleTwoFactor}

          disabled={loading}

          className={`
            rounded-full
            px-4
            py-2
            text-sm
            font-semibold
            ${
              active
              ? "bg-green-500/20 text-green-400"
              : "bg-slate-800 text-slate-300"
            }
          `}

        >

          {loading
            ? "Updating..."
            : active
              ? "Enabled"
              : "Disabled"
          }

        </button>


      </div>





      {message && (

        <div
          className="
            rounded-xl
            bg-slate-950
            p-4
            text-sm
            text-cyan-400
          "
        >

          {message}

        </div>

      )}


    </div>

  );

}