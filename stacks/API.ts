import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  NodejsFunction,
  NodejsFunctionProps,
  LogLevel,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

const lambdaFnProps: Partial<NodejsFunctionProps> = {
  bundling: {
    target: "es2020",
    keepNames: true,
    logLevel: LogLevel.INFO,
    sourceMap: true,
    minify: true,
  },
  runtime: lambda.Runtime.NODEJS_16_X,
  timeout: cdk.Duration.seconds(6),
  memorySize: 512,
  logRetention: RetentionDays.ONE_DAY,
  environment: {
    NODE_OPTIONS: "--enable-source-maps",
  },
};

interface LambdaApiStackProps extends cdk.StackProps {}

export class LambdaApiStack extends Construct {
  constructor(parent: cdk.Stack, name: string, props: LambdaApiStackProps) {
    super(parent, name);

    const httpApi = new HttpApi(this, "http-api-example", {
      description: "HTTP API example",
      corsPreflight: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: [
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
        ],
        allowOrigins: ["*"],
      },
    });

    // 👇 create get-todos Lambda
    // const simpleLambda = new lambda.Function(this, "get-data", {
    //   runtime: lambda.Runtime.NODEJS_16_X,
    //   handler: "simple.handler",
    //   code: new lambda.AssetCode(`./services/dist`),
    // });

    const newFunc = new NodejsFunction(this, "GetData", {
      ...lambdaFnProps,
      entry: "./services/functions/simple.ts", // accepts .js, .jsx, .ts and .tsx files
      functionName: "simple",
      handler: "handler",
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });

    const newFuncRPC = new NodejsFunction(this, "GetRPC", {
      ...lambdaFnProps,
      entry: "./services/functions/tRPC.ts", // accepts .js, .jsx, .ts and .tsx files
      functionName: "tRPC",
      handler: "handler",
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });

    // const tRPCLambda = new lambda.Function(this, "get-trpc", {
    //   runtime: lambda.Runtime.NODEJS_16_X,
    //   handler: "tRPC.handler",
    //   code: new lambda.AssetCode(`./services/dist`),
    // });

    // 👇 add route for GET /todos
    httpApi.addRoutes({
      path: "/simple",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration("beta-integration", newFunc),
    });

    // 👇 add route for GET /todos
    httpApi.addRoutes({
      path: "/beta/{proxy+}",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration("beta-integration2", newFuncRPC),
    });

    new cdk.CfnOutput(this, "apiUrl", {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: httpApi.url!,
    });
  }
}
