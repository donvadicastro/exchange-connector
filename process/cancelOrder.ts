import {ExchangeConnectorProcessBase} from "./base/processBase";
import {ICancelOrderMessage} from "../contracts/messages/cancelOrderMessage";

export class CancelOrder extends ExchangeConnectorProcessBase {
    onMessage(message: ICancelOrderMessage) {
        const exchange = this.getExchange(message.exchange);

        //handle invalid exchange properly
        if(!exchange) {
            return;
        }

        //check action is allowed on selected exchange
        if(!exchange.has['cancelOrder']) {
            return this.kafkaClient.sendError(`"cancelOrder" is not supported on "${message.exchange}"`);
        }

        console.log(`Order to be cancelled on "${message.exchange}" with params: ${JSON.stringify(message)}`);
        exchange.cancelOrder(message.id, message.symbol, message.params)
            .then((data: any) => this.send(data), (error: any) => this.sendError(error));
    }
}