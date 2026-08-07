import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import DashboardLayout from "@/components/dashboard/DashboardLayout";



export const dynamic = "force-dynamic";



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const session =
    await getServerSession(authOptions);





  if (!session) {

    redirect("/login");

  }





  const role =
    (session.user as any).role;





  if (role !== "ADMIN") {

    redirect("/dashboard");

  }






  return (

    <DashboardLayout>

      {children}

    </DashboardLayout>

  );

}