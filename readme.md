# attester

This project simulates an attestation service that can sign and
make available MessageSent events for transport to remote
domains ala CCTP. 

This is for fun, don't deploy anywhere important.

## Misc

### Infrastructure

cdk deploy
cdk destroy

### Raw Processor

event looks like: 

```
{
    "Records": [
        {
            "messageId": "8f22ce80-8564-4b6c-903b-2b1ff74333a7",
            "receiptHandle": "AQEBn8W3GfKyHxEYAKN6n5ADUd26t0Q9pJrE5W7xYQbDTy4M6S+yeZo0/X8K5XVZoDoTgYWvqIeodCySRCWsl5FE6mNvrKVIhkGYyyLNZqPe4nXbmIz8sqNkP6Lh55RZdrbDCV20BfASuw/SeVL3i6W1MF8MlO1NYjD94Ynf8DPw2uMpFZr+eWxFXnyqzDHaJ45vGxl+VRrke13vOrcSujTdPSL4eRk3jdr/SxYSMWRR63NppvWmxXXcJ+ZuB7sadYI9VKZtqUABEEPlDLcpD+BSZzbXpXzsoTOxp7A0ccRV/PPqla57FaTQWxUKxNDT+ERlLeggB4yVPa0uxt24EG5JQ+35LcEqIX1cJ4uuLcndf5C6OZFCVIdaZPdoM5mllZhnx/THYgpbwQsbJgxC8Eud5Q==",
            "body": "{\"message\":\"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000d8000000010000000100000002000000000000000b0000000000000000000000009949f7e672a568bb3ebeb777d5e8d1c1107e96e50000000000000000000000009949f7e672a568bb3ebeb777d5e8d1c1107e96e500000001000000000000000000000000a7f08a6f40a00f4ba0ee5700f730421c5810f8480000000000000000000000009949f7e672a568bb3ebeb777d5e8d1c1107e96e500000000000000000000000000000000000000000000000000000000000000060000000000000000000000009949f7e672a568bb3ebeb777d5e8d1c1107e96e50000000000000000\",\"txnHash\":\"0x9b69e5d511597fbded301af4f84d6287945db45ed93c08e615188354071ef84e\"}",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1677194819123",
                "SenderId": "AIDATLMAJ6XMODUWTB7S7",
                "ApproximateFirstReceiveTimestamp": "1677194819135"
            },
            "messageAttributes": {},
            "md5OfBody": "a3acadde5a3d7afca69bf58701c4ebfe",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-1:nnnnnnnnnnnn:qqqqqq",
            "awsRegion": "us-east-1"
        }
    ]
}
```

## Signer

Inject signing key, e.g. 

```
# private key for ganache test account 10
aws secretsmanager create-secret --name sk2 --secret-string "0xf9832eeac47db42efeb2eca01e6479bfde00fda8fdd0624d45efd0e4b9ddcd3b"
```

## Querying the table


aws dynamodb query --table-name attestations --region us-east-1 --key-condition-expression "msgHash = :hashval" --expression-attribute-values '{":hashval":{"S":"0x60c1276a0d88019dd227999a1673a5a4ff90dbee845b1b2d6915b1516379b9a3"}}'


## Table Cleanup

aws dynamodb delete-table --table-name attestations