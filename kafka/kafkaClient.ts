import {utils} from "../utils";
import {
    Client, Consumer, HighLevelConsumer, HighLevelProducer, KafkaClient, Message, Producer,
    TopicsNotExistError
} from "kafka-node";

const config = require('../package.json');

/**
 * Kafka client.
 */
export class KafkaClientExt {
    private client: KafkaClient;
    private producer: HighLevelProducer;

    public topics: string[] = [];

    constructor() {
        this.client = new KafkaClient({kafkaHost: config.kafka.url, clientId: "exchange-connector"});
        this.producer = new HighLevelProducer(this.client);
    }

    public async initialize(): Promise<void> {
        await this.connect();
        await this.createTopics(this.topics);
    }

    public send(topic: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.producer.send([{ topic: topic, messages: utils.encode(data), partition: 0}],
                (error, data) => error ? reject(error) : resolve())
        });
    }

    public sendError(data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.producer.send([{ topic: 'exchange-connector-error', messages: utils.encode(data), partition: 0}],
                (error, data) => error ? reject(error) : resolve())
        });
    }

    public listen(topic: string, callback: (data: any) => void, errorCallback: (error: any) => void): Consumer {
        const consumer = new Consumer(this.client, [{topic: topic}], config.kafka.consumer);
        console.log(`Connecting to "${topic}" topic`);

        consumer.on('message', (message: Message) => callback(utils.decode(message)));
        consumer.on('error', error => errorCallback(error));

        return consumer;
    }

    private connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.producer.on('ready', () => {
                console.log("Kafka Client Producer is connected and ready.");
                resolve();
            });

            this.producer.on("error", (err: any) => reject(err));
        });
    }

    private createTopics(topics: string[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`Create topic: "${topics}"`);
            this.producer.createTopics(topics, (error, data) => error ? reject(error) : resolve());
        });
    }
}