const  Web3 = require('web3');
const web3 = new Web3();

const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager")
const client = new SecretsManagerClient();

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const ddbClient = new DynamoDBClient();

let secretName = process.env.SECRET_NAME;
console.log(secretName);

let signingKey;

let loadSigningKey = async () => {
    const params = {
        SecretId: secretName
    };
    const command = new GetSecretValueCommand(params);
    const data = await client.send(command);
    return data.SecretString;
};


const handler = async (event) => {
    console.log(JSON.stringify(event));
    if (signingKey == null) {
        console.log("loading signing key");
        signingKey = await loadSigningKey();
    }
    console.log(secretName);
    console.log(signingKey); //NO!

    for(const record of event.Records) {
        //Decode the payload
        const payload = JSON.parse(record.body);

        // Decode the log data 
        const messageBytes = web3.eth.abi.decodeParameters(['bytes'],payload.message)[0];
        console.log(`messageBytes: ${messageBytes}`)
        const messageHash = web3.utils.keccak256(messageBytes);
        console.log(`messageHash: ${messageHash}`);

        //Sign the hash of the message bytes

        const signed = web3.eth.accounts.sign(messageHash,signingKey);
        console.log(signed);

        //Todo - store the txnhash, message hash, and message signature in the db
        let putParams = {
            TableName: 'attestations',
            Item: {
                msgHash: { S: messageHash },
                txnHash: { S: payload.txnHash },
                signature: { S: signed.signature}
            }
        };

        let putCmd = new PutItemCommand(putParams);
        await ddbClient.send(putCmd);
    }
}

module.exports = {
    handler
}