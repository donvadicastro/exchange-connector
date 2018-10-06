import {ExchangeConnectorProcessBase} from "../../process/base/processBase";
import {KafkaClientExt} from "../../kafka/kafkaClient";

const connectorBase = new ExchangeConnectorProcessBase(new KafkaClientExt(), [''], '');

describe('ExchangeConnectorProcessBase', () => {
    it('should get credentials', () => {
        const exchange = connectorBase.getExchange('exmo');

        expect(exchange).toBeDefined();
        expect(exchange.apiKey).toBeDefined();
        expect(exchange.secret).toBeDefined();
    });
});