import Link from "next/link";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { marketService } from "@/server/services/market.service";
import { userWalletService } from "@/server/services/user-wallet.service";

import {
Wallet,
TrendingUp,
PieChart,
} from "lucide-react";


export const dynamic = "force-dynamic";


export default async function PortfolioPage() {


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
] =
await Promise.all([

marketService.getMarkets(),

userWalletService.getUserWallets(
userId
),

]);



const portfolio =
wallets.map((wallet)=>{


const symbol =
wallet.currency.code.toUpperCase();



const market =
markets.find(
(coin)=>
coin.symbol.toUpperCase() === symbol
);



const balance =
Number(
wallet.balance ??
wallet.availableBalance ??
0
);



const value =
market
?
balance * market.current_price
:
0;



return {

symbol,

name:
wallet.currency.name,

balance,

value,

change:
market?.price_change_percentage_24h ?? 0,

market,

};


});



const totalValue =
portfolio.reduce(
(total,asset)=>
total + asset.value,
0
);



const totalChange =
portfolio.reduce(
(total,asset)=>

total +
(
asset.value *
(asset.change / 100)
),

0
);



return (

<div className="space-y-8">



{/* Header */}

<div>

<h1 className="text-3xl font-bold text-white">

Portfolio

</h1>


<p className="mt-2 text-slate-400">

Track your digital asset holdings and performance.

</p>

</div>





{/* Summary Cards */}

<div className="grid gap-6 md:grid-cols-3">


<div
className="
rounded-2xl
border
border-slate-800
bg-slate-950
p-6
"
>

<Wallet className="text-cyan-400"/>


<p className="mt-4 text-slate-400">

Total Balance

</p>


<h2 className="mt-2 text-3xl font-bold text-white">

$
{totalValue.toLocaleString(
undefined,
{
minimumFractionDigits:2,
maximumFractionDigits:2
}
)}

</h2>

</div>





<div
className="
rounded-2xl
border
border-slate-800
bg-slate-950
p-6
"
>

<TrendingUp className="text-green-400"/>


<p className="mt-4 text-slate-400">

24H Performance

</p>


<h2 className="mt-2 text-3xl font-bold text-green-400">

+
$
{totalChange.toLocaleString(
undefined,
{
minimumFractionDigits:2,
maximumFractionDigits:2
}
)}

</h2>


</div>





<div
className="
rounded-2xl
border
border-slate-800
bg-slate-950
p-6
"
>

<PieChart className="text-purple-400"/>


<p className="mt-4 text-slate-400">

Assets

</p>


<h2 className="mt-2 text-3xl font-bold text-white">

{portfolio.length}

</h2>


</div>


</div>








{/* Allocation */}

<div
className="
rounded-2xl
border
border-slate-800
bg-slate-950
p-6
"
>

<h2 className="text-xl font-semibold text-white">

Portfolio Allocation

</h2>



<div className="mt-6 space-y-4">


{
portfolio.map((asset)=>{


const percentage =
totalValue > 0
?
(asset.value / totalValue) * 100
:
0;


return (

<div
key={asset.symbol}
>


<div className="flex justify-between">

<span className="text-white">

{asset.symbol}

</span>


<span className="text-slate-400">

{percentage.toFixed(2)}%

</span>


</div>



<div className="mt-2 h-2 rounded-full bg-slate-800">


<div

className="
h-full
rounded-full
bg-cyan-400
"

style={{
width:`${percentage}%`
}}

/>


</div>


</div>

)

})

}


</div>


</div>







{/* Holdings */}

<div
className="
rounded-2xl
border
border-slate-800
bg-slate-950
p-6
"
>

<h2 className="text-xl font-semibold text-white">

Holdings

</h2>




<div className="mt-6 space-y-4">


{
portfolio.length === 0

?

<p className="text-slate-400">

No assets assigned yet.

</p>


:


portfolio.map((asset)=>(


<Link

key={asset.symbol}

href={`/dashboard/assets/${asset.symbol}`}

className="
block
rounded-xl
border
border-slate-800
p-5
transition
hover:bg-slate-900
"

>


<div className="flex justify-between">


<div>


<h3 className="font-semibold text-white">

{asset.name}

</h3>


<p className="text-sm text-slate-400">

{asset.balance.toLocaleString()} {asset.symbol}

</p>


{
asset.market && (

<p className="mt-2 text-sm text-slate-400">

Price: $

{asset.market.current_price.toLocaleString()}

</p>

)

}


</div>




<div className="text-right">


<p className="font-semibold text-white">

$
{asset.value.toLocaleString(
undefined,
{
minimumFractionDigits:2,
maximumFractionDigits:2
}
)}

</p>



<p
className={`
text-sm
${
asset.change >=0
?
"text-green-400"
:
"text-red-400"
}
`}
>

{asset.change >=0 ? "+" : ""}

{asset.change.toFixed(2)}%

</p>


</div>


</div>


</Link>


))

}


</div>


</div>


</div>

);

}