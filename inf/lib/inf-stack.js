const { Stack, Duration, CfnOutput } = require('aws-cdk-lib');
const sqs = require('aws-cdk-lib/aws-sqs');
const lambda = require('aws-cdk-lib/aws-lambda');
const iam = require('aws-cdk-lib/aws-iam');

class InfStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);


    // Raw message queue
    const queue = new sqs.Queue(this, 'RawMessageSent', {
       visibilityTimeout: Duration.seconds(300),
       queueName: 'RawMessageSentQ'
    });

    const lambdaRole = new iam.Role(this, 'lamdbaQueueReader', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaSQSQueueExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    })

    // Lambda to process the raw message queue
    const myLambda = new lambda.Function(this, 'RawProcessor', {
      functionName: 'RawProcessorFn',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'rawprocessor.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      role: lambdaRole
    });

    const eventSourceMapping = new lambda.EventSourceMapping(
      this, 'rawProcessorMapping', {
        target: myLambda,
        batchSize: 5,
        eventSourceArn: queue.queueArn
      }
    );

    new CfnOutput(this, 'qUrlOut', {
      value: queue.queueUrl,
      description: 'queue url'
    });


  }
}

module.exports = { InfStack }
