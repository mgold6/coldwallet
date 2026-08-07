"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


const data = [
  {
    time: "00:00",
    value: 13200000,
  },
  {
    time: "04:00",
    value: 13350000,
  },
  {
    time: "08:00",
    value: 13420000,
  },
  {
    time: "12:00",
    value: 13600000,
  },
  {
    time: "16:00",
    value: 13550000,
  },
  {
    time: "20:00",
    value: 13634453,
  },
];


export default function PortfolioChart() {

return (

<div
className="
rounded-3xl
border
border-slate-800
bg-slate-950
p-6
"
>

<h2 className="text-xl font-semibold text-white">

Portfolio Performance

</h2>


<p className="mt-2 text-sm text-slate-400">

Asset value movement

</p>


<div
className="
mt-6
h-72
"
>

<ResponsiveContainer
width="100%"
height="100%"
>

<LineChart
data={data}
>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis
dataKey="time"
stroke="#94a3b8"
/>


<YAxis
stroke="#94a3b8"
tickFormatter={(value)=>`$${(value/1000000).toFixed(1)}M`}
/>


<Tooltip
formatter={(value)=>[
`$${Number(value).toLocaleString()}`,
"Portfolio"
]}
/>


<Line

type="monotone"

dataKey="value"

stroke="#06b6d4"

strokeWidth={3}

dot={false}

/>


</LineChart>


</ResponsiveContainer>


</div>


</div>

);

}