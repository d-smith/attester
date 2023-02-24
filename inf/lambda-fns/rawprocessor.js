const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager")
const client = new SecretsManagerClient();

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
}

module.exports = {
    handler
}