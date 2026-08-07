"use client";

import { useState } from "react";


export default function ChangePasswordForm() {


  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);





  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    setMessage("");



    if (newPassword !== confirmPassword) {

      setMessage(
        "New passwords do not match."
      );

      return;

    }




    setLoading(true);



    try {


      const response =
        await fetch(
          "/api/security/password",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },


            body: JSON.stringify({

              currentPassword,

              newPassword,

            }),

          }
        );





      const data =
        await response.json();




      if (!response.ok) {

        throw new Error(
          data.error ||
          "Password update failed."
        );

      }




      setMessage(
        "Password updated successfully."
      );


      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");



    } catch(error:any) {


      setMessage(
        error.message
      );


    } finally {

      setLoading(false);

    }


  }







  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >


      <input

        type="password"

        placeholder="Current password"

        value={currentPassword}

        onChange={(e)=>
          setCurrentPassword(
            e.target.value
          )
        }

        className="
          w-full
          rounded-xl
          bg-slate-950
          p-4
          text-white
        "

      />





      <input

        type="password"

        placeholder="New password"

        value={newPassword}

        onChange={(e)=>
          setNewPassword(
            e.target.value
          )
        }

        className="
          w-full
          rounded-xl
          bg-slate-950
          p-4
          text-white
        "

      />






      <input

        type="password"

        placeholder="Confirm new password"

        value={confirmPassword}

        onChange={(e)=>
          setConfirmPassword(
            e.target.value
          )
        }

        className="
          w-full
          rounded-xl
          bg-slate-950
          p-4
          text-white
        "

      />







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







      <button

        disabled={loading}

        className="
          rounded-xl
          bg-cyan-400
          px-6
          py-3
          font-semibold
          text-black
          disabled:opacity-50
        "

      >

        {loading
          ? "Updating..."
          : "Update Password"
        }

      </button>




    </form>

  );

}