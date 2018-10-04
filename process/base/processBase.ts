import {KafkaClientExt} from "../../kafka/kafkaClient";
import {exchanges} from "ccxt";

const config = require('../../package.json');
const ccxt = require('ccxt');

export class ExchangeConnectorProcessBase {
    kafkaClient: KafkaClientExt;
    topicIn: string;
    topicOut: string;


    constructor(kafkaClient: KafkaClientExt, topicIn: string, topicOut: string) {
        this.kafkaClient = kafkaClient;
        this.topicIn = topicIn;
        this.topicOut = topicOut;

        this.kafkaClient.topics.push(topicIn, topicOut);
    }

    getExchange(exchangeName: string): any {
        if(exchanges.indexOf(exchangeName) === -1) {
            this.kafkaClient.sendError(`exchange "${exchangeName}" not exists`);
            return null;
        }

        return new ccxt[exchangeName]({...config.ccxt.exchange.config, ...config.ccxt.exchange[exchangeName]});
    }

    public run() {
        this.kafkaClient.listen(this.topicIn, this.onMessage.bind(this), this.onError.bind(this));
    }

    protected onMessage(message: any) {
    }

    protected onError(error: any) {
    }

    protected send(data: any) {
        console.log(`Success response to be sent to "${this.topicOut}": ${JSON.stringify(data)}`);
        this.kafkaClient.send(this.topicOut, data);
    }

    protected sendError(error: any) {
        console.log('ERROR: ', error);
        this.kafkaClient.sendError(error);
    }
}