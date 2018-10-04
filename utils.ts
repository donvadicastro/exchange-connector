import {Message} from "kafka-node";

export const utils = {
    decode: (message: Message): any => {
        const buf = new Buffer(<string>message.value, "binary");
        return JSON.parse(buf.toString());
    },

    encode: (data: any): string => {
        return JSON.stringify(data);
    }
};