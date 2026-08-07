import Link from "next/link";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { marketService } from "@/server/services/market.service";
import { userWalletService } from "@/server/services/user-wallet.service";
import { transactionService } from "@/server/services/transaction.service";

import QuickActions from "@/components/dashboard/QuickActions";
import Tokens from "@/components/dashboard/Tokens";
import TransactionHistory from "@/components/dashboard/TransactionHistory";

export const dynamic = "force-dynamic";


export default async function DashboardPage() {


const session =
await getServerSession(authOptions);



if (!session) {

redirect("/login");

}



const userId =
(session.user as any).id;



const [
markets,
wallets,
transactions,
] =
await Promise.all([

marketService.getMarkets(),

userWalletService.getUserWallets(
userId
),

transactionService.getUserTransactions(
userId
),

]);



const serializedWallets =
wallets.map((wallet)=>({

...wallet,

balance:
Number(wallet.balance ?? 0),

availableBalance:
Number(wallet.availableBalance ?? 0),

blockchainBalance:
Number(wallet.blockchainBalance ?? 0),

internalBalance:
Number(wallet.internalBalance ?? 0),

lockedBalance:
Number(wallet.lockedBalance ?? 0),

}));



const totalBalance =
serializedWallets.reduce(

(total,wallet)=>{


const symbol =
wallet.currency.code.toLowerCase();



const market =
markets.find(

(coin)=>
coin.symbol.toLowerCase() === symbol

);



const balance =
Number(
wallet.balance ??
wallet.availableBalance ??
0
);



const usdValue =
market
?
balance * market.current_price
:
0;



return total + usdValue;


},

0

);



const totalChange =
serializedWallets.reduce(

(total,wallet)=>{


const symbol =
wallet.currency.code.toLowerCase();



const market =
markets.find(

(coin)=>
coin.symbol.toLowerCase() === symbol

);



const balance =
Number(
wallet.availableBalance ??
wallet.balance ??
0
);



const usdValue =
market
?
balance * market.current_price
:
0;



const change =
market
?
usdValue *
(
market.price_change_percentage_24h /
100
)
:
0;



return total + change;


},

0

);



const totalChangePercentage =
totalBalance > 0

?
(
totalChange /
totalBalance
) * 100

:
0;



return (

<div className="space-y-8">



{/* Header */}

<section
className="
flex
items-center
justify-between
"
>

<div>

<h1 className="text-3xl font-bold text-white">
Dashboard
</h1>


<p className="mt-1 text-sm text-slate-400">
Manage your digital assets securely.
</p>


</div>






</section>





{/* Tabs */}

<div
className="
flex
gap-8
border-b
border-slate-800
pb-3
"
>

<Link
  href="/dashboard"
  className="
    border-b-2
    border-cyan-400
    pb-3
    text-white
  "
>
  Explore
</Link>


<Link
  href="/dashboard/stocks"
  className="
    text-slate-400
    hover:text-white
  "
>
  Stocks
</Link>


<Link
  href="/dashboard/watchlist"
  className="
    text-slate-400
    hover:text-white
  "
>
  Watchlist
</Link>


</div>





{/* Total Balance */}

<section

className="
rounded-3xl
border
border-slate-800
bg-gradient-to-br
from-slate-900
to-slate-950
p-8
"

>


<p className="text-sm text-slate-400">
Total Balance
</p>



<h2

className="
mt-3
text-5xl
font-bold
text-white
"

>

$
{totalBalance.toLocaleString(

undefined,

{
minimumFractionDigits:2,
maximumFractionDigits:2,
}

)}

</h2>



<p

className={`
mt-2
font-medium
${
totalChange >= 0
?
"text-green-400"
:
"text-red-400"
}
`}

>

{totalChange >=0 ? "+" : "-"}

$

{Math.abs(totalChange).toLocaleString(

undefined,

{
minimumFractionDigits:2,
maximumFractionDigits:2,
}

)}

{" "}

(

{totalChangePercentage >=0 ? "+" : ""}

{totalChangePercentage.toFixed(2)}

%)

</p>


</section>






{/* Actions */}

<QuickActions />






{/* Tokens */}

<Tokens

markets={markets}

wallets={serializedWallets}

/>






{/* Activity */}

<TransactionHistory

transactions={transactions}

/>


</div>

);

}