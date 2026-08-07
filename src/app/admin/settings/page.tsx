import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import SettingsForm from "./SettingsForm";


export default async function AdminSettingsPage() {

  const session =
    await getServerSession(authOptions);


  if (!session) {
    redirect("/login");
  }


  const settings =
    await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            "withdrawal_insufficient_balance",
          ],
        },
      },
    });


  const withdrawalMessage =
    settings.find(
      (setting) =>
        setting.key ===
        "withdrawal_insufficient_balance"
    )?.value ??
    "Your withdrawal request cannot be completed at this time. Please contact support.";


  return (

    <div className="space-y-8">

      <section>

        <h1 className="text-3xl font-bold text-white">
          Admin Settings
        </h1>


        <p className="mt-2 text-slate-400">
          Manage messages shown to users.
        </p>

      </section>
            <SettingsForm
        withdrawalMessage={
          withdrawalMessage
        }
      />

    </div>

  );

}