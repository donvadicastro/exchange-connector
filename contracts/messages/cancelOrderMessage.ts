export interface ICancelOrderMessage {
    exchange: string;
    id: string;
    symbol?: string;
    params?: {};
}