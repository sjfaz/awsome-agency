import { CfnOutput, Stack, Duration } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { lambdaFnProps } from "./utils";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class Database extends Construct {
  public readonly table: dynamodb.Table;
  constructor(parent: Stack, name: string, props: {}) {
    super(parent, name);

    const table = new dynamodb.Table(this, "Table", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    const newFunc = new NodejsFunction(this, "GetData", {
      ...lambdaFnProps,
      entry: "./services/functions/stream-processor.ts", // accepts .js, .jsx, .ts and .tsx files
      functionName: "stream-processor",
      handler: "handler",
      memorySize: 512,
      timeout: Duration.seconds(30),
    });

    newFunc.addEventSource(
      new DynamoEventSource(table, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );

    this.table = table;
    new CfnOutput(this, "TableName", { value: table.tableName });
  }
}

/*
aws dynamodb put-item \
    --table-name Table \
    --item '{
        "pk": {"S": "EVENT#NEWAPP"}
        "sk": {"S": "2022-01-01"}
      }'
*/
