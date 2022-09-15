import { CfnOutput, Stack, Duration, aws_sqs, aws_ssm } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { lambdaFnProps } from "./utils";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {
  DynamoEventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";

export class Database extends Construct {
  public readonly table: dynamodb.Table;
  constructor(parent: Stack, name: string, props: {}) {
    super(parent, name);

    const table = new dynamodb.Table(this, "OrdersTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    const marketingQueue = new aws_sqs.Queue(this, "MarketingQueue");

    const streamProcessor = new NodejsFunction(this, "GetStreamData", {
      ...lambdaFnProps,
      entry: "./services/functions/stream-processor.ts", // accepts .js, .jsx, .ts and .tsx files
      handler: "handler",
      memorySize: 512,
      timeout: Duration.seconds(30),
      environment: {
        QUEUE_URL: marketingQueue.queueUrl,
      },
    });

    marketingQueue.grantSendMessages(streamProcessor);

    // Add DynamoDB event source
    streamProcessor.addEventSource(
      new DynamoEventSource(table, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );

    // Add SQS event source
    const sqsLambda = new NodejsFunction(this, "SQSMarketingLambda", {
      ...lambdaFnProps,
      entry: "./services/functions/marketing-sqs-handler.ts", // accepts .js, .jsx, .ts and .tsx files
      functionName: "marketing-sqs-handler",
      handler: "handler",
      memorySize: 512,
      timeout: Duration.seconds(30),
      environment: {
        SLACK_URL: aws_ssm.StringParameter.valueForStringParameter(
          this,
          "/awesome-agency/slack-url"
        ),
      },
    });

    sqsLambda.addEventSource(
      new SqsEventSource(marketingQueue, {
        batchSize: 1,
      })
    );

    this.table = table;
    new CfnOutput(this, "TableName", { value: table.tableName });
  }
}
