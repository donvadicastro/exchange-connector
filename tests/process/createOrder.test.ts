import {CreateOrder} from "../../process/createOrder";
import {KafkaClientExt} from "../../kafka/kafkaClient";

const ccxt = require('ccxt');

describe('CreateOrder', () => {
    const kafka = new KafkaClientExt();
    const createOrder = new CreateOrder(kafka, 'a', 'b');

    it('check incorrecnt exchange', () => {
        spyOn(kafka, 'sendError');

        createOrder.onMessage({exchange: 'exch', symbol: 'symb', type: 'limit', side: 'sell', amount: 123});
        expect(kafka.sendError).toHaveBeenCalledWith('exchange "exch" not exists');
    });

    it('check create order', () => {
        const exchange = new ccxt.kraken();
        createOrder.getExchange = jasmine.createSpy().and.returnValue(exchange);
        exchange.createOrder = jasmine.createSpy().and.returnValue(Promise.resolve());

        createOrder.onMessage({exchange: 'kraken', symbol: 'symb', type: 'limit', side: 'sell', amount: 123});
        expect(exchange.createOrder).toHaveBeenCalledWith('symb', 'limit', 'sell', 123, undefined, undefined);
    });

});