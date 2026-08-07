import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import LogoutButton from "@/components/security/LogoutButton";
import ChangePasswordForm from "@/components/security/ChangePasswordForm";
import TwoFactorToggle from "@/components/security/TwoFactorToggle";
import LoginHistory from "@/components/security/LoginHistory";

import prisma from "@/lib/prisma";



export default async function SettingsPage() {


  const session =
    await getServerSession(authOptions);



  if (!session) {

    redirect("/login");

  }





  const userId =
    (session.user as any).id;





  const twoFactorEnabled =
    (session.user as any).isTwoFactorEnabled || false;





  const loginLogs =
    await prisma.loginHistory.findMany({

      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 10,

    });








  return (

    <div className="space-y-8">


      <section>

        <h1 className="text-3xl font-bold text-white">
          Account & Security
        </h1>


        <p className="mt-2 text-slate-400">
          Manage your account and wallet security settings.
        </p>

      </section>







      <section
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
          Profile
        </h2>



        <div>

          <p className="text-sm text-slate-400">
            Name
          </p>


          <p className="mt-1 text-white">
            {session.user?.name || "ColdWallet User"}
          </p>

        </div>





        <div>

          <p className="text-sm text-slate-400">
            Email
          </p>


          <p className="mt-1 text-white">
            {session.user?.email}
          </p>

        </div>


      </section>









      <section
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
          Wallet Security
        </h2>




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
              Wallet Encryption
            </p>


            <p className="text-sm text-slate-400">
              Private keys are encrypted securely.
            </p>

          </div>



          <span className="
            rounded-full
            bg-green-500/20
            px-3
            py-1
            text-sm
            text-green-400
          ">
            Active
          </span>


        </div>






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
              Account Protection
            </p>


            <p className="text-sm text-slate-400">
              Keep your login credentials secure.
            </p>

          </div>



          <span className="
            rounded-full
            bg-cyan-500/20
            px-3
            py-1
            text-sm
            text-cyan-400
          ">
            Protected
          </span>


        </div>


      </section>









      <section
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
          Two-Factor Authentication
        </h2>


        <TwoFactorToggle
          enabled={twoFactorEnabled}
        />


      </section>








      <section
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
          Login Activity
        </h2>


        <p className="text-sm text-slate-400">
          Review recent account access activity.
        </p>



        <LoginHistory
          logs={loginLogs}
        />


      </section>








      <section
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
          Change Password
        </h2>


        <p className="text-sm text-slate-400">
          Update your account password regularly to keep your account secure.
        </p>


        <ChangePasswordForm />


      </section>








      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <h2 className="text-xl font-bold text-white">
          Security Recommendations
        </h2>


        <ul className="mt-4 space-y-3 text-sm text-slate-400">

          <li>
            ✓ Use a strong unique password
          </li>


          <li>
            ✓ Keep wallet recovery information secure
          </li>


          <li>
            ✓ Verify transaction details before confirming
          </li>


          <li>
            ✓ Never share private wallet credentials
          </li>


        </ul>


      </section>








      <section
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
          Account Actions
        </h2>



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
              Sign out of account
            </p>


            <p className="text-sm text-slate-400">
              End your current session securely.
            </p>

          </div>



          <LogoutButton />

        </div>


      </section>




    </div>

  );

}