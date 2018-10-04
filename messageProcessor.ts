import {Message, Producer} from "kafka-node";
import {utils} from "./utils";

const sendTopic = 'exchange-connector-write';
export function processMessage(message: Message, producer: Producer) {
    const data: any = utils.decode(message);
    send(producer, data);
}

function send(producer: Producer, data: any) {
    producer.send([{ topic: sendTopic, partition: 0, messages: utils.encode(data)}],
        (error, data) => error && console.log(error)
    );
}