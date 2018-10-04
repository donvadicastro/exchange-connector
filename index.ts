import {KafkaClientExt} from "./kafka/kafkaClient";
import {CreateOrder} from "./process/createOrder";

const client: KafkaClientExt = new KafkaClientExt();
const createOrderProcess = new CreateOrder(client, 'exchange-connector-create-order-in', 'exchange-connector-create-order-out');

client.initialize().then(() => {
    createOrderProcess.run();
});