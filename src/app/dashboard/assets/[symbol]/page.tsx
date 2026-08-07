import Link from "next/link";

import {
ArrowLeft,
Send,
Download,
Repeat,
ShoppingCart,
} from "lucide-react";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { marketService } from "@/server/services/market.service";
import { userWalletService } from "@/server/services/user-wallet.service";
import { transactionService } from "@/server/services/transaction.service";

import PriceChart from "@/components/dashboard/PriceChart";


const coinIds: Record<string,string> = {

BTC:"bitcoin",
ETH:"ethereum",
SOL:"solana",
XRP:"ripple",
ADA:"cardano",
BNB:"binancecoin",
AVAX:"avalanche-2",
DOGE:"dogecoin",
LTC:"litecoin",
USDT:"tether",

};



const descriptions: Record<string,string> = {

BTC:
"Bitcoin is the first decentralized digital currency designed for peer-to-peer transactions without a central authority.",

ETH:
"Ethereum is a blockchain platform that enables smart contracts and decentralized applications.",

SOL:
"Solana is a high-performance blockchain designed for fast transactions and scalable applications.",

XRP:
"XRP is a digital asset designed for fast and efficient global payments.",

ADA:
"Cardano is a proof-of-stake blockchain focused on security and sustainability.",

BNB:
"BNB powers the BNB Chain ecosystem and decentralized applications.",

AVAX:
"Avalanche is a scalable blockchain platform for decentralized applications.",

DOGE:
"Dogecoin is a community-driven cryptocurrency.",

LTC:
"Litecoin is a peer-to-peer cryptocurrency designed for fast payments.",

USDT:
"Tether is a stablecoin designed to maintain value close to one US dollar.",

};



export default async function AssetPage({

params,

}: {

params: Promise<{
symbol:string;
}>;

}) {


const {
symbol:rawSymbol
}=await params;



const symbol =
rawSymbol.toUpperCase();



const session =
await getServerSession(authOptions);



if (!session) {

return null;

}



const userId =
(session.user as any).id;



const [

markets,

wallets,

transactions,

chartData,

] = await Promise.all([


marketService.getMarkets(),


userWalletService.getUserWallets(
userId
),


transactionService.getUserTransactions(
userId
),


marketService.getChart(
coinIds[symbol]
),


]);



const market =
markets.find(

(coin)=>
coin.id === coinIds[symbol]

);



const wallet =
wallets.find(

(item)=>
item.currency.code.toUpperCase() === symbol

);



const balance =
Number(
wallet?.balance ??
wallet?.availableBalance ??
0
);



const usdValue =
market
?
balance * market.current_price
:
0;



const assetTransactions =
transactions.filter(

(transaction)=>
transaction.currency.code.toUpperCase() === symbol

);
return (

<div className="space-y-8">



{/* Back */}

<Link

href="/dashboard"

className="
flex
items-center
gap-2
text-gray-400
hover:text-white
"

>

<ArrowLeft size={18}/>

Back to Dashboard

</Link>







{/* Asset Header */}

<section

className="
rounded-3xl
border
border-gray-800
bg-slate-950
p-6
"

>


<div className="flex items-center justify-between">


<div>


<h1 className="text-3xl font-bold text-white">

{market?.name ?? symbol}

</h1>



<p className="mt-2 text-gray-400">

{symbol} Asset Overview

</p>


</div>




<div className="text-right">


<p className="text-3xl font-bold text-white">

$

{market?.current_price.toLocaleString(
undefined,
{
maximumFractionDigits:8
}
)}

</p>



{
market && (

<p

className={`
mt-2
font-medium
${
market.price_change_percentage_24h >= 0
?
"text-green-400"
:
"text-red-400"
}
`}

>

{
market.price_change_percentage_24h >= 0
?
"+"
:
""
}

{market.price_change_percentage_24h.toFixed(2)}%

(24H)

</p>

)

}


</div>


</div>


</section>








{/* Summary */}

<section

className="
rounded-xl
border
border-gray-800
bg-slate-950
p-6
"

>


<h2 className="text-xl font-semibold text-white">

About {market?.name ?? symbol}

</h2>



<p className="mt-4 text-gray-400">

{descriptions[symbol] ??
"Digital asset information unavailable."}

</p>


</section>







{/* Holdings + Market */}

<section

className="
grid
gap-6
lg:grid-cols-2
"

>



<div

className="
rounded-xl
border
border-gray-800
bg-slate-950
p-6
"

>


<h2 className="text-xl font-semibold text-white">

Your Holdings

</h2>



<p className="mt-5 text-gray-400">

Balance

</p>



<h3 className="mt-2 text-4xl font-bold text-white">

{balance.toLocaleString(
undefined,
{
maximumFractionDigits:8
}
)} {symbol}

</h3>



<p className="mt-3 text-2xl text-cyan-400">

$

{usdValue.toLocaleString(
undefined,
{
minimumFractionDigits:2,
maximumFractionDigits:2
}
)}

</p>


</div>







<div

className="
rounded-xl
border
border-gray-800
bg-slate-950
p-6
"

>


<h2 className="text-xl font-semibold text-white">

Market Statistics

</h2>




<div className="mt-5 space-y-4 text-gray-300">


<div className="flex justify-between">

<span>
Market Cap
</span>


<span className="text-white">

$
{market?.market_cap.toLocaleString() ?? "-"}

</span>


</div>





<div className="flex justify-between">

<span>
24H Volume
</span>


<span className="text-white">

$
{market?.total_volume.toLocaleString() ?? "-"}

</span>


</div>





<div className="flex justify-between">

<span>
Rank
</span>


<span className="text-white">

#{market?.market_cap_rank ?? "-"}

</span>


</div>



</div>


</div>


</section>
{/* Price Chart */}

<section

className="
rounded-xl
border
border-gray-800
bg-slate-950
p-6
"

>

<h2 className="mb-5 text-xl font-semibold text-white">

24H Price Chart

</h2>



<div className="h-72">

<PriceChart

data={chartData}

/>

</div>


</section>







{/* Wallet Information */}

<section

className="
rounded-xl
border
border-gray-800
bg-slate-950
p-6
"

>

<h2 className="text-xl font-semibold text-white">

Wallet Information

</h2>



<div className="mt-5 space-y-4">


<div className="flex justify-between">

<span className="text-gray-400">

Network

</span>


<span className="text-white">

{wallet?.network?.name ?? "Main Network"}

</span>


</div>





<div>

<p className="text-gray-400">

Wallet Address

</p>


<p className="mt-2 break-all text-sm text-white">

{wallet?.address ?? "No wallet address assigned"}

</p>


</div>



</div>


</section>







{/* Actions */}

<section

className="
grid
gap-4
md:grid-cols-4
"

>


<Link

href={`/dashboard/buy?asset=${symbol}`}

className="
flex
items-center
justify-center
rounded-lg
bg-cyan-500
px-5
py-3
font-medium
text-black
hover:bg-cyan-400
"

>

<ShoppingCart
size={18}
className="mr-2"
/>

Buy

</Link>







<Link

href={`/dashboard/send?asset=${symbol}`}

className="
flex
items-center
justify-center
rounded-lg
bg-cyan-500
px-5
py-3
font-medium
text-black
hover:bg-cyan-400
"

>

<Send
size={18}
className="mr-2"
/>

Send

</Link>







<Link

href={`/dashboard/receive?asset=${symbol}`}

className="
flex
items-center
justify-center
rounded-lg
bg-cyan-500
px-5
py-3
font-medium
text-black
hover:bg-cyan-400
"

>

<Download
size={18}
className="mr-2"
/>

Receive

</Link>







<Link

href={`/dashboard/swap?asset=${symbol}`}

className="
flex
items-center
justify-center
rounded-lg
bg-cyan-500
px-5
py-3
font-medium
text-black
hover:bg-cyan-400
"

>

<Repeat
size={18}
className="mr-2"
/>

Swap

</Link>


</section>







{/* Transactions */}

<section

className="
rounded-xl
border
border-gray-800
bg-slate-950
p-6
"

>


<h2 className="text-xl font-semibold text-white">

Recent Transactions

</h2>



<div className="mt-5 space-y-3">


{
assetTransactions.length === 0

?

<p className="text-gray-400">

No transactions found for {symbol}.

</p>


:

assetTransactions.map((transaction)=>(


<div

key={transaction.id}

className="
flex
items-center
justify-between
rounded-xl
bg-slate-900
p-4
"

>


<div>


<p className="font-semibold text-white">

{transaction.type}

</p>



<p className="text-sm text-gray-400">

{
new Date(
transaction.createdAt
).toLocaleDateString()
}

</p>


</div>




<div className="text-right">


<p className="text-white">

{transaction.amount.toString()} {symbol}

</p>



<p

className={`text-sm
${
transaction.status === "COMPLETED"
?
"text-green-400"
:
transaction.status === "FAILED"
?
"text-red-400"
:
"text-yellow-400"
}
`}

>

{transaction.status}

</p>


</div>


</div>


))


}


</div>


</section>



</div>

);

}