import  Web3 from 'web3';
const web3 = new Web3('ws://127.0.0.1:8545');

import  { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
// Set the AWS Region.
const REGION = "us-east-1";
// Create SQS service object.
const sqsClient = new SQSClient({ region: REGION });

const queueUrl = process.env.RAW_Q_URL;

let  eventSig = web3.utils.keccak256('MessageSent(bytes)');
console.log(`sig is ${eventSig}`);

const processLogData = async(log) => {
    console.log(log);

    let messageBody = {
        message: log.data,
        txnHash: log.transactionHash
    };

    let input = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageBody),
    };

    const command = new SendMessageCommand(input);
    const response = await sqsClient.send(command);

    console.log(response);
}

web3.eth.subscribe('logs', {
    address: '0xC0a4b9e04fB55B1b498c634FAEeb7C8dD5895b53',
    topics: [eventSig]
}, (error, result) => {
    if (error)
        console.error(error);
})
    .on("data", processLogData)
    .on("connected", function (log) {
        console.log(log);
    });
