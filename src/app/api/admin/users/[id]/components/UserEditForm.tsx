"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserEditForm({
  user,
}: {
  user: {
    id: string;
    role: string;
    status: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}) {
  const router = useRouter();

  const [role, setRole] = useState(user.role);

  const [status, setStatus] = useState(user.status);

  const [firstName, setFirstName] = useState(
    user.firstName ?? ""
  );

  const [lastName, setLastName] = useState(
    user.lastName ?? ""
  );

  const [saving, setSaving] = useState(false);


  async function saveUser() {

    setSaving(true);


    await fetch(`/api/admin/users/${user.id}`, {

      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        role,
        status,
        firstName,
        lastName,
      }),

    });


    setSaving(false);

    router.refresh();

  }



  return (

    <section
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-900
        p-6
        space-y-5
      "
    >

      <h2 className="text-xl font-semibold text-white">
        User Management
      </h2>



      <div>

        <label className="text-sm text-slate-400">
          Role
        </label>


        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="
            mt-2
            w-full
            rounded-lg
            bg-slate-950
            p-3
            text-white
          "
        >

          <option value="USER">
            USER
          </option>


          <option value="ADMIN">
            ADMIN
          </option>

        </select>

      </div>





      <div>

        <label className="text-sm text-slate-400">
          Status
        </label>


        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="
            mt-2
            w-full
            rounded-lg
            bg-slate-950
            p-3
            text-white
          "
        >

          <option value="ACTIVE">
            ACTIVE
          </option>


          <option value="PENDING">
            PENDING
          </option>


          <option value="SUSPENDED">
            SUSPENDED
          </option>


          <option value="DISABLED">
            DISABLED
          </option>

        </select>

      </div>





      <div className="grid gap-4 md:grid-cols-2">

        <input
          value={firstName}
          onChange={(e) =>
            setFirstName(e.target.value)
          }
          placeholder="First Name"
          className="
            rounded-lg
            bg-slate-950
            p-3
            text-white
          "
        />



        <input
          value={lastName}
          onChange={(e) =>
            setLastName(e.target.value)
          }
          placeholder="Last Name"
          className="
            rounded-lg
            bg-slate-950
            p-3
            text-white
          "
        />

      </div>





      <button
        onClick={saveUser}
        disabled={saving}
        className="
          rounded-lg
          bg-cyan-500
          px-5
          py-3
          font-semibold
          text-black
        "
      >

        {saving
          ? "Saving..."
          : "Save Changes"}

      </button>


    </section>

  );

}