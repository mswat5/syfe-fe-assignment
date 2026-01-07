export type Currency="INR"|"USD"

export type Contribution={
    id:string,
    amount:number,
    date:string
}
export type Goal={
    id:string,
    name:string,
    totalAmount:number,
    currency:Currency,
    contributions:Contribution[],
}