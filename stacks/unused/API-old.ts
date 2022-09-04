import {
  LambdaIntegration,
  MethodLoggingLevel,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Function, Runtime, AssetCode, Code } from "aws-cdk-lib/aws-lambda";
import { Duration, Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import s3 = require("aws-cdk-lib/aws-s3");
import { Construct } from "constructs";

interface LambdaApiStackProps extends StackProps {
  functionName: string;
}

export class LambdaApiStack extends Construct {
  private restApi: RestApi;
  private lambdaFunction: Function;
  private bucket: s3.Bucket;

  constructor(parent: Stack, name: string, props: LambdaApiStackProps) {
    super(parent, name);

    this.bucket = new s3.Bucket(this, "WidgetStore");

    this.restApi = new RestApi(this, parent.stackName + "RestApi", {
      deployOptions: {
        stageName: "beta",
        metricsEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    const lambdaPolicy = new PolicyStatement();
    lambdaPolicy.addActions("s3:ListBucket");
    lambdaPolicy.addResources(this.bucket.bucketArn);

    this.lambdaFunction = new Function(this, props.functionName, {
      functionName: props.functionName,
      handler: "tRPC.handler",
      runtime: Runtime.NODEJS_16_X,
      code: new AssetCode(`./services/dist`),
      memorySize: 512,
      timeout: Duration.seconds(30),
      environment: {
        BUCKET: this.bucket.bucketName,
      },
      initialPolicy: [lambdaPolicy],
    });

    this.restApi.root.addMethod(
      "GET",
      new LambdaIntegration(this.lambdaFunction, {})
    );

    // this.restApi.root

    new CfnOutput(this, "API Url", {
      value: this.restApi.url,
    });
  }
}
