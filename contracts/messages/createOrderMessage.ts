export interface ICreateOrderMessage {
    exchange: string;
    symbol: string;
    type: 'market' | 'limit';
    side: 'buy' | 'sell';
    amount: number;
    price?: number;
    params?: {};
}