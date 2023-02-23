const { Stack, Duration } = require('aws-cdk-lib');
const sqs = require('aws-cdk-lib/aws-sqs');
import { SQSClient } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({Region:"us-east-1"});

class InfStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    const queue = new sqs.Queue(this, 'RawMessageSent', {
       visibilityTimeout: Duration.seconds(300),
       queueName: 'RawMessageSentQ'
    });
  }
}

module.exports = { InfStack }
