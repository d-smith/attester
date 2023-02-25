const { DynamoDBClient, QueryCommand  } = require("@aws-sdk/client-dynamodb");
const ddbClient = new DynamoDBClient();


const handler = async (event) => {
    console.log("request:", JSON.stringify(event, undefined, 2));

    let parts = event.path.split('/').filter(s => s != '');
    if(parts.length != 1) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "text/plain" },
            body: 'expected single message hash resource'
          };
    }

    let request = parts[0];
    console.log(`request is ${request}`);

    let queryCommand = new QueryCommand(
        {
            TableName: 'attestations',
            KeyConditionExpression: 'msgHash = :h',
            ExpressionAttributeValues: {
                ":h" : { S : request },
            }
        }
    );

    let result = await ddbClient.send(queryCommand);
    console.log(JSON.stringify(result));

    let attestation = "";
    if(result.Items.length == 1) {
        attestation = result.Items[0].signature.S;
    }


    let response = {
        "attestation": attestation
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response)
    };
};


module.exports = {
    handler
}