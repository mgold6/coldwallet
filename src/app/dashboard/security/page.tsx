"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ShieldCheck,
  Lock,
  History,
} from "lucide-react";


type LoginRecord = {
  id: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
};



export default function SecurityPage() {


  const [twoFactorEnabled, setTwoFactorEnabled] =
    useState(false);


  const [loginHistory, setLoginHistory] =
    useState<LoginRecord[]>([]);


  const [loading, setLoading] =
    useState(true);



  const [currentPassword, setCurrentPassword] =
    useState("");


  const [newPassword, setNewPassword] =
    useState("");


  const [changingPassword, setChangingPassword] =
    useState(false);




  async function loadSecurityData() {

    try {

      const response =
        await fetch(
          "/api/security/login-history"
        );


      const data =
        await response.json();


      if (Array.isArray(data)) {

        setLoginHistory(data);

      }


    } catch(error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }




  useEffect(() => {

    loadSecurityData();

  }, []);





  async function updateTwoFactor(
    enabled:boolean
  ) {


    try {

      const response =
        await fetch(
          "/api/security/2fa",
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body:JSON.stringify({
              enabled,
            }),
          }
        );


      const data =
        await response.json();


      if(data.success){

        setTwoFactorEnabled(
          enabled
        );


        toast.success(
          "Two-factor authentication updated."
        );

      }


    } catch(error){

      toast.error(
        "Unable to update 2FA."
      );

    }

  }





  async function changePassword(){

    if(
      !currentPassword ||
      !newPassword
    ){

      toast.error(
        "Enter both passwords."
      );

      return;

    }



    setChangingPassword(true);


    try{


      const response =
        await fetch(
          "/api/security/password",
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body:JSON.stringify({

              currentPassword,

              newPassword,

            }),

          }
        );


      const data =
        await response.json();



      if(data.success){

        toast.success(
          "Password updated."
        );


        setCurrentPassword("");

        setNewPassword("");

      } else {

        toast.error(
          data.error ??
          "Password update failed."
        );

      }


    }catch(error){

      toast.error(
        "Password update failed."
      );


    }finally{

      setChangingPassword(false);

    }


  }





  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-3xl font-bold text-white">
          Security Center
        </h1>


        <p className="mt-2 text-slate-400">
          Manage your account protection and security settings.
        </p>


      </div>





      <div className="grid gap-6 md:grid-cols-3">


        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <ShieldCheck className="text-cyan-400"/>

          <h2 className="mt-4 text-xl font-semibold text-white">
            Security Score
          </h2>


          <p className="mt-2 text-3xl font-bold text-cyan-400">
            100%
          </p>


        </div>





        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <Lock className="text-cyan-400"/>


          <h2 className="mt-4 text-xl font-semibold text-white">
            Two Factor Authentication
          </h2>



          <button

            onClick={()=>
              updateTwoFactor(
                !twoFactorEnabled
              )
            }

            className="
              mt-4
              rounded-lg
              bg-cyan-500
              px-4
              py-2
              text-sm
              font-medium
              text-black
            "

          >

            {twoFactorEnabled
              ? "Disable 2FA"
              : "Enable 2FA"
            }

          </button>


        </div>





        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

          <History className="text-cyan-400"/>


          <h2 className="mt-4 text-xl font-semibold text-white">
            Login History
          </h2>


          <p className="mt-2 text-slate-400">
            {loginHistory.length} recent sessions
          </p>


        </div>


      </div>







      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">


        <h2 className="text-xl font-semibold text-white">
          Change Password
        </h2>



        <div className="mt-5 grid gap-4 md:grid-cols-2">


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
              rounded-lg
              bg-slate-900
              p-3
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
              rounded-lg
              bg-slate-900
              p-3
              text-white
            "

          />


        </div>




        <button

          onClick={changePassword}

          disabled={changingPassword}

          className="
            mt-5
            rounded-lg
            bg-cyan-500
            px-5
            py-2
            font-medium
            text-black
          "

        >

          {changingPassword
            ? "Updating..."
            : "Update Password"
          }


        </button>


      </div>








      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">


        <h2 className="text-xl font-semibold text-white">
          Recent Login Activity
        </h2>



        {loading ? (

          <p className="mt-4 text-slate-400">
            Loading...
          </p>

        ) : loginHistory.length === 0 ? (

          <p className="mt-4 text-slate-400">
            No login activity found.
          </p>

        ) : (

          <div className="mt-5 space-y-3">


            {loginHistory.map((login)=>(

              <div
                key={login.id}
                className="
                  rounded-lg
                  bg-slate-900
                  p-4
                "
              >

                <p className="text-white">
                  {login.ipAddress ?? "Unknown IP"}
                </p>


                <p className="text-sm text-slate-400">
                  {new Date(
                    login.createdAt
                  ).toLocaleString()}
                </p>


              </div>

            ))}


          </div>

        )}


      </div>



    </div>

  );

}
