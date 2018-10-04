## Prerequisites for client
* install "Git" client
* install "NodeJS" LTS version

## Download project
```
git clone https://github.com/donvadicastro/exchange-connector.git
cd exchange-connector
```

#### install dependencies through command line 
```
#install choco
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

#install NodeJS
choco install nodejs-lts
```

## Prerequisites for local kafka (if needed)
* install [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/)

## Prerequisites for Raspberry
* initialize
```
./scripts/raspberry-init.sh
```

## Windows installation
* install [Microsoft build tools](http://www.microsoft.com/en-us/download/details.aspx?id=40760)
* run PowerShell console with admin rights 
```
npm install --global --production windows-build-tools
npm config set msvs_version 2017 --global
npm install
```

## Linux installation
```
npm install
```

## Run local kafka
* open "Docker terminal"
* run "`./scripts/run-kafks.sh`" script
* do not close terminal

## Description
This project aims on creation of integration bridge to help execute financial operation 
with different clients based on action type involved.

Solution was developed using message-driven architecture, 
so all communications fulfilled through Kafka message bus.

This particular project was used to define and develop thin clients 
that will be responsible to process business events.

## Start client
```
npm start
```

## Test client
```
npm test
```

## Create new worker
Worker is an nodeJS client that is connected to particular message queue and execute defined action based on
defined instruction.

### Create message contract
Initially contract of input message should be defined. All message contract are placed in "contracts/messages" folder
and are represented as TypeScript interface.

Example:
```typescript
export interface ICreateOrderMessage {
    exchange: string;
    symbol: string;
    type: 'market' | 'limit';
    side: 'buy' | 'sell';
    amount: number;
    price?: number;
    params?: {};
}
``` 

### Define worker
All executors are stored in "process" folder and are represented as TypeScript class inherited from "ExchangeConnectorProcessBase" base class.
Need to be implemented action that will be triggered on message.

Example:
```typescript
export class CreateOrder extends ExchangeConnectorProcessBase {
    onMessage(message: ICreateOrderMessage) {
        const exchange = this.getExchange(message.exchange);

        //handle invalid exchange properly
        if(!exchange) {
            return;
        }

        //check action is allowed on selected exchange
        if(!exchange.has['createMarketOrder']) {
            return this.kafkaClient.sendError(`"createMarketOrder" is not supported on "${message.exchange}"`);
        }

        console.log(`Order to be created on "${message.exchange}" with params: ${JSON.stringify(message)}`);
        exchange.createOrder(message.symbol, message.type, message.side, message.amount, message.price, message.params)
            .then((data: any) => this.send(data), (error: any) => this.sendError(error));
    }
}
```

### Add worker to pipeline
Once executor is created - it need to be registered in execution pipeline to be available to handle input messages.
Registration should be added in "index.ts".

Example:
```typescript
const client: KafkaClientExt = new KafkaClientExt();

//create executor instance, when 
const createOrderProcess = new CreateOrder(client, 'topic-to-read-messages-from', 'topic-to-generate-messages-to');

client.initialize().then(() => {
    //start executor to handle events
    createOrderProcess.run();
});
```

### Set access credentials
If actions are requires authentication - auth config for particular exchange need to be specified in "package.json" file
in "ccxt -> exchange" section. Example:
```json
"binance": {
    "apiKey": "key",
    "secret": "secret"
}
```

### Verification
To check that worker is available and processed events correctly, test message can be triggered:
```
node tests/sendMessage.js <topicName> <message>
```

when:
* topicName - name of the topic data will be posted to
* message - string representation of message payload in JSON format. 
Example: `"{\"exchange\": \"exmo\", \"symbol\": \"ZEC/USD\", \"type\": \"limit\", \"side\": \"buy\", \"amount\": 0.01, \"price\": 50}"`