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


interface PricePoint {
  time: string;
  price: number;
}


interface PriceChartProps {
  data: PricePoint[];
}



export default function PriceChart({
  data,
}: PriceChartProps) {


return (

<div
className="
h-[350px]
w-full
rounded-xl
border
border-slate-800
bg-slate-950
p-4
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
/>


<YAxis
domain={[
"auto",
"auto",
]}
tickFormatter={(value)=>`$${value}`}
/>


<Tooltip
formatter={(value)=>[
`$${Number(value).toLocaleString()}`,
"Price",
]}
/>


<Line

type="monotone"

dataKey="price"

strokeWidth={3}

dot={false}

stroke="#06b6d4"

/>


</LineChart>


</ResponsiveContainer>


</div>

);


}