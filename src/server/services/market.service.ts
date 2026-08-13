const COINS = [
  "bitcoin",
  "ethereum",
  "solana",
  "ripple",
  "cardano",
  "binancecoin",
  "avalanche-2",
  "dogecoin",
  "litecoin",
  "tether",
];


export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply?: number;
  market_cap_rank?: number;
}


export interface ChartPoint {
  time: string;
  price: number;
}



export class MarketService {


private getHeaders(): HeadersInit {

const apiKey =
process.env.COINGECKO_API_KEY


const headers: HeadersInit = {};


if (apiKey) {

headers["x-cg-demo-api-key"] =
apiKey;

}


return headers;

}







async getMarkets(): Promise<MarketCoin[]> {


const response =
await fetch(

`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(",")}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,

{
headers:
this.getHeaders(),

next:{
revalidate:60,
},
}

);



if (!response.ok) {

throw new Error(
"Unable to load market data."
);

}



return response.json();


}









async getChart(
coinId:string
): Promise<ChartPoint[]> {


const response =
await fetch(

`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`,

{
headers:
this.getHeaders(),

next:{
revalidate:60,
},
}

);





if (!response.ok) {

throw new Error(
"Unable to load chart data."
);

}





const data =
await response.json();





return data.prices.map(
(point:[number,number])=>({

time:
new Date(point[0])
.toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit",
}
),

price:
point[1],

})

);


}






}



export const marketService =
new MarketService();