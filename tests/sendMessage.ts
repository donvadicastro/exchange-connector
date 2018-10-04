import {KafkaClientExt} from "../kafka/kafkaClient";

const client = new KafkaClientExt();

//CMD params example: exchange-connector-create-order-in "{\"exchange\": \"exmo\", \"symbol\": \"ZEC/USD\", \"type\": \"limit\", \"side\": \"buy\", \"amount\": 0.01, \"price\": 50}"
client.send(process.argv[2], JSON.parse(process.argv[3]));