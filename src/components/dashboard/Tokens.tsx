"use client";

import Link from "next/link";


interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}


interface Wallet {
  id: string;
  balance: any;
  availableBalance?: any;

  currency:{
    code:string;
    name:string;
  };
}


interface TokensProps {
  markets:MarketCoin[];
  wallets:Wallet[];
}



const supportedTokens = [
  "BTC",
  "ETH",
  "SOL",
  "XRP",
  "USDT",
  "ADA",
  "BNB",
  "AVAX",
  "DOGE",
  "LTC",
];



export default function Tokens({
  markets,
  wallets,
}:TokensProps){


const walletMap =
wallets.reduce(
(acc:any,wallet)=>{

acc[
wallet.currency.code.toUpperCase()
]=wallet;

return acc;

},
{}
);



const tokens =
supportedTokens.map(symbol=>{


const wallet =
walletMap[symbol];


const market =
markets.find(
coin =>
coin.symbol.toUpperCase()===symbol
);



const balance =
wallet
?
Number(
wallet.balance ??
wallet.availableBalance ??
0
)
:
0;



const value =
market
?
balance *
market.current_price
:
0;



const change =
market
?
value *
(
market.price_change_percentage_24h /
100
)
:
0;



return {

symbol,

name:
wallet?.currency.name ?? symbol,

balance,

value,

change,

market

};


});



return (

<section>


<h2
className="
mb-5
text-2xl
font-bold
text-white
"
>
Tokens
</h2>



<div
className="
space-y-4
"
>


{
tokens.map(token=>(


<Link
key={token.symbol}
href={`/dashboard/assets/${token.symbol}`}
className="
block
rounded-2xl
bg-slate-950
border
border-slate-800
p-5
transition
hover:bg-slate-900
"
>



<div
className="
flex
items-center
justify-between
"
>



<div
className="
flex
items-center
gap-4
"
>



<div
className="
flex
h-12
w-12
items-center
justify-center
rounded-full
bg-slate-800
"
>


{
token.market
?
<img
src={token.market.image}
alt={token.name}
className="
h-9
w-9
"
/>

:

<span
className="
text-cyan-400
text-xl
"
>
◉
</span>

}


</div>



<div>


<h3
className="
font-semibold
text-white
"
>
{token.name}
</h3>



<p
className="
text-sm
text-slate-400
"
>
{
token.balance.toLocaleString(
undefined,
{
maximumFractionDigits:8
}
)
}
{" "}
{token.symbol}
</p>



</div>


</div>





<div
className="
text-right
"
>


<p
className="
text-lg
font-bold
text-white
"
>

$
{
token.value.toLocaleString(
undefined,
{
minimumFractionDigits:2,
maximumFractionDigits:2
}
)
}

</p>



<p
className={`
text-sm
font-medium
${
token.change >=0
?
"text-green-400"
:
"text-red-400"
}
`}
>

{
token.change >=0
?
"+$"
:
"-$"
}

{
Math.abs(
token.change
).toLocaleString(
undefined,
{
minimumFractionDigits:2,
maximumFractionDigits:2
}
)
}

</p>



</div>




</div>


</Link>


))

}



</div>


</section>

);

}