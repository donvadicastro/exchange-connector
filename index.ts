import {KafkaClientExt} from "./kafka/kafkaClient";
import {CreateOrder} from "./process/createOrder";
import {CancelOrder} from "./process/cancelOrder";

const client: KafkaClientExt = new KafkaClientExt();
const createOrderProcess = new CreateOrder(client, 'exchange-connector-create-order-in', 'exchange-connector-create-order-out');
const cancelOrderProcess = new CancelOrder(client, 'exchange-connector-cancel-order-in', 'exchange-connector-cancel-order-out');

client.initialize().then(() => {
   createOrderProcess.run();
   cancelOrderProcess.run();
});