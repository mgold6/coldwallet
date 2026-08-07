const earningPrograms = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    apy: "3.25%",
    lock: "Flexible",
    frequency: "Daily",
    minimum: "0.001 BTC",
    status: "Available",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    apy: "4.50%",
    lock: "Flexible",
    frequency: "Daily",
    minimum: "0.01 ETH",
    status: "Available",
  },
  {
    symbol: "SOL",
    name: "Solana",
    apy: "6.80%",
    lock: "30 Days",
    frequency: "Daily",
    minimum: "1 SOL",
    status: "Available",
  },
  {
    symbol: "XRP",
    name: "XRP",
    apy: "2.50%",
    lock: "Flexible",
    frequency: "Daily",
    minimum: "10 XRP",
    status: "Coming Soon",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    apy: "3.90%",
    lock: "Flexible",
    frequency: "Daily",
    minimum: "10 ADA",
    status: "Available",
  },
  {
    symbol: "BNB",
    name: "BNB",
    apy: "5.20%",
    lock: "30 Days",
    frequency: "Daily",
    minimum: "0.1 BNB",
    status: "Available",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    apy: "5.80%",
    lock: "Flexible",
    frequency: "Daily",
    minimum: "0.5 AVAX",
    status: "Available",
  },
  {
    symbol: "USDT",
    name: "Tether",
    apy: "8.00%",
    lock: "Flexible",
    frequency: "Daily",
    minimum: "10 USDT",
    status: "Available",
  },
];


const education = [
  {
    title: "How Staking Works",
    description:
      "Staking allows digital assets to participate in blockchain operations while earning potential rewards.",
  },
  {
    title: "Understanding Rewards",
    description:
      "Rewards vary based on network conditions, asset availability, and program terms.",
  },
  {
    title: "Security First",
    description:
      "Always review risks and only use earning programs that match your security preferences.",
  },
];


export default function EarnPage() {


return (

<div className="space-y-8">



<section>

<h1 className="text-3xl font-bold text-white">

Earn

</h1>


<p className="mt-2 text-slate-400">

Grow your digital assets through staking and reward opportunities.

</p>

</section>








<div className="grid gap-6 md:grid-cols-4">



<div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

<p className="text-sm text-slate-400">

Total Earning Balance

</p>

<h2 className="mt-3 text-3xl font-bold text-white">

$0.00

</h2>

</div>





<div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

<p className="text-sm text-slate-400">

Active Positions

</p>

<h2 className="mt-3 text-3xl font-bold text-white">

0

</h2>

</div>





<div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

<p className="text-sm text-slate-400">

Monthly Rewards

</p>

<h2 className="mt-3 text-3xl font-bold text-white">

$0.00

</h2>

</div>





<div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

<p className="text-sm text-slate-400">

Average APY

</p>

<h2 className="mt-3 text-3xl font-bold text-cyan-400">

5.20%

</h2>

</div>



</div>









<section

className="
rounded-3xl
border
border-slate-800
bg-slate-950
p-6
"

>


<h2 className="mb-6 text-xl font-semibold text-white">

Available Earn Programs

</h2>



<div className="space-y-4">


{
earningPrograms.map((asset)=>(


<div

key={asset.symbol}

className="
rounded-xl
border
border-slate-800
bg-slate-900
p-5
"

>


<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">



<div>


<h3 className="text-lg font-semibold text-white">

{asset.name}

</h3>


<p className="text-sm text-slate-400">

{asset.symbol}

</p>


</div>





<div>

<p className="text-sm text-slate-400">

APY

</p>

<p className="font-semibold text-cyan-400">

{asset.apy}

</p>

</div>





<div>

<p className="text-sm text-slate-400">

Lock Period

</p>

<p className="text-white">

{asset.lock}

</p>

</div>





<div>

<p className="text-sm text-slate-400">

Rewards

</p>

<p className="text-white">

{asset.frequency}

</p>

</div>





<div>

<p className="text-sm text-slate-400">

Minimum

</p>

<p className="text-white">

{asset.minimum}

</p>

</div>





<button

className="
rounded-lg
bg-cyan-500
px-4
py-2
text-sm
font-medium
text-black
hover:bg-cyan-400
"

>

{asset.status === "Available"
?
"Start Earning"
:
"Coming Soon"
}

</button>



</div>


</div>


))

}


</div>


</section>









<section

className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"

>


<h2 className="text-xl font-semibold text-white">

Your Active Positions

</h2>


<p className="mt-3 text-slate-400">

You currently have no active earning positions.

</p>


</section>









<section>


<h2 className="mb-5 text-xl font-semibold text-white">

Learn About Earn

</h2>


<div className="grid gap-6 md:grid-cols-3">


{
education.map((item)=>(


<div

key={item.title}

className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"

>

<h3 className="font-semibold text-white">

{item.title}

</h3>


<p className="mt-3 text-sm text-slate-400">

{item.description}

</p>


</div>


))

}


</div>


</section>









<section

className="
rounded-xl
border
border-yellow-500/30
bg-yellow-500/10
p-6
"

>


<h2 className="font-semibold text-yellow-400">

Risk Disclosure

</h2>


<p className="mt-3 text-sm text-slate-300">

Earning programs may involve risks including market volatility,
network changes, lock-up periods, and changing reward rates.
Always review program details before committing digital assets.

</p>


</section>






</div>

);


}