import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { userWalletService } from "@/server/services/user-wallet.service";
import { marketService } from "@/server/services/market.service";

import SendForm from "./components/SendForm";


export default async function SendPage() {


  const session =
    await getServerSession(authOptions);



  if (!session) {

    redirect("/login");

  }



  const userId =
    (session.user as any).id;




  const [
    wallets,
    markets,
  ] =
    await Promise.all([

      userWalletService.getUserWallets(
        userId
      ),

      marketService.getMarkets(),

    ]);






  return (

    <div className="mx-auto max-w-xl space-y-8">


      <section>

        <h1 className="text-3xl font-bold text-white">
          Send Crypto
        </h1>


        <p className="mt-2 text-slate-400">
          Transfer digital assets securely.
        </p>


      </section>





      <SendForm

        wallets={wallets}

        markets={markets}

      />



    </div>

  );

}