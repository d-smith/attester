import Web3 from 'web3';
const web3 = new Web3(process.env.EVENT_ENDPOINT); // e.g. ws://127.0.0.1:8545

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// Set the AWS Region.
const REGION = "us-east-1";
// Create SQS service object.
const sqsClient = new SQSClient({ region: REGION });

const queueUrl = process.env.RAW_Q_URL;

let eventSig = web3.utils.keccak256('MessageSent(bytes)');
console.log(`sig is ${eventSig}`);

const processLogData = async (log) => {
    console.log(log);

    const messageBytes = web3.eth.abi.decodeParameters(['bytes'], log.data)[0];
    console.log(`messageBytes: ${messageBytes}`);
    const messageHash = web3.utils.keccak256(messageBytes);
    console.log(`messageHash: ${messageHash}`);

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
    address: process.env.CONTRACT_ADDRESS,
    topics: [eventSig]
}, (error, result) => {
    if (error)
        console.error(error);
})
    .on("data", processLogData)
    .on("connected", function (log) {
        console.log(log);
    });
