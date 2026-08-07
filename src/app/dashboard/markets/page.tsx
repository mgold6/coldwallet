import Link from "next/link";

import { marketService } from "@/server/services/market.service";

import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
} from "lucide-react";


export const dynamic = "force-dynamic";


export default async function MarketsPage() {


const markets =
await marketService.getMarkets();




const sortedMarkets =
[...markets]
.sort(
(a,b)=>
b.market_cap -
a.market_cap
)
.slice(0,50);





const gainers =
[...markets]
.sort(
(a,b)=>
b.price_change_percentage_24h -
a.price_change_percentage_24h
)
.slice(0,3);





const losers =
[...markets]
.sort(
(a,b)=>
a.price_change_percentage_24h -
b.price_change_percentage_24h
)
.slice(0,3);





const totalMarketCap =
markets.reduce(
(total,coin)=>
total + coin.market_cap,
0
);




const totalVolume =
markets.reduce(
(total,coin)=>
total + coin.total_volume,
0
);



return (

<div className="space-y-8">


<section>

<h1 className="text-3xl font-bold text-white">

Markets

</h1>


<p className="mt-2 text-slate-400">

Track cryptocurrency prices, market movements, and digital assets.

</p>


</section>
<div className="grid gap-6 md:grid-cols-4">


<div
className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"
>

<DollarSign
className="text-cyan-400"
/>


<p className="mt-4 text-sm text-slate-400">

Market Cap

</p>


<h3 className="mt-2 text-2xl font-bold text-white">

$
{totalMarketCap.toLocaleString(
undefined,
{
maximumFractionDigits:0,
}
)}

</h3>


</div>







<div
className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"
>

<BarChart3
className="text-purple-400"
/>


<p className="mt-4 text-sm text-slate-400">

24H Volume

</p>


<h3 className="mt-2 text-2xl font-bold text-white">

$
{totalVolume.toLocaleString(
undefined,
{
maximumFractionDigits:0,
}
)}

</h3>


</div>







<div
className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"
>

<TrendingUp
className="text-green-400"
/>


<p className="mt-4 text-sm text-slate-400">

Top Gainer

</p>


<h3 className="mt-2 font-bold text-white">

{gainers[0]?.symbol.toUpperCase()}

</h3>


<p className="text-green-400">

+
{gainers[0]?.price_change_percentage_24h.toFixed(2)}%

</p>


</div>







<div
className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"
>

<TrendingDown
className="text-red-400"
/>


<p className="mt-4 text-sm text-slate-400">

Top Loser

</p>


<h3 className="mt-2 font-bold text-white">

{losers[0]?.symbol.toUpperCase()}

</h3>


<p className="text-red-400">

{losers[0]?.price_change_percentage_24h.toFixed(2)}%

</p>


</div>


</div>









<div className="grid gap-6 lg:grid-cols-2">





<div
className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"
>


<h2 className="mb-5 text-xl font-semibold text-white">

Top Gainers

</h2>



<div className="space-y-3">


{
gainers.map((coin)=>(


<Link

key={coin.id}

href={`/dashboard/assets/${coin.symbol.toUpperCase()}`}

className="
flex
items-center
justify-between
rounded-lg
bg-slate-900
p-4
hover:bg-slate-800
"

>


<div className="flex items-center gap-3">


<img

src={coin.image}

alt={coin.name}

className="
h-8
w-8
rounded-full
"

/>


<span className="text-white">

{coin.symbol.toUpperCase()}

</span>


</div>



<span className="text-green-400">

+
{coin.price_change_percentage_24h.toFixed(2)}%

</span>



</Link>


))
}


</div>


</div>







<div
className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"
>


<h2 className="mb-5 text-xl font-semibold text-white">

Top Losers

</h2>



<div className="space-y-3">


{
losers.map((coin)=>(


<Link

key={coin.id}

href={`/dashboard/assets/${coin.symbol.toUpperCase()}`}

className="
flex
items-center
justify-between
rounded-lg
bg-slate-900
p-4
hover:bg-slate-800
"

>


<div className="flex items-center gap-3">


<img

src={coin.image}

alt={coin.name}

className="
h-8
w-8
rounded-full
"

/>


<span className="text-white">

{coin.symbol.toUpperCase()}

</span>


</div>



<span className="text-red-400">

{coin.price_change_percentage_24h.toFixed(2)}%

</span>



</Link>


))
}


</div>


</div>
</div>









<section

className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"

>


<h2

className="
mb-6
text-xl
font-semibold
text-white
"

>

Cryptocurrency Markets

</h2>





<div className="space-y-3">



{
sortedMarkets.map((coin)=>(


<Link

key={coin.id}

href={`/dashboard/assets/${coin.symbol.toUpperCase()}`}

className="
grid
grid-cols-12
items-center
gap-4
rounded-xl
bg-slate-900
p-4
transition
hover:bg-slate-800
"

>





<div

className="
col-span-5
flex
items-center
gap-4
"

>


<img

src={coin.image}

alt={coin.name}

className="
h-10
w-10
rounded-full
"

/>


<div>


<p className="font-semibold text-white">

{coin.name}

</p>


<p className="text-sm text-slate-400">

{coin.symbol.toUpperCase()}

</p>


</div>


</div>








<div

className="
col-span-2
text-right
text-white
"

>

$

{coin.current_price.toLocaleString(
undefined,
{
maximumFractionDigits:8,
}
)}

</div>







<div

className={`
col-span-2
text-right
font-medium
${
coin.price_change_percentage_24h >=0
?
"text-green-400"
:
"text-red-400"
}
`}

>

{coin.price_change_percentage_24h >=0
?
"+"
:
""
}

{coin.price_change_percentage_24h.toFixed(2)}%

</div>








<div

className="
col-span-3
text-right
text-sm
text-slate-300
"

>

$

{coin.market_cap.toLocaleString(
undefined,
{
maximumFractionDigits:0,
}
)}

</div>






</Link>


))
}


</div>



</section>





</div>

);


}