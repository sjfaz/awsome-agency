import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import * as cdk from "aws-cdk-lib";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { lambdaFnProps } from "./utils";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface LambdaApiStackProps extends cdk.StackProps {
  table: ITable;
}

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
      environment: { TABLE_NAME: props.table.tableName },
      timeout: cdk.Duration.seconds(30),
    });

    props.table.grantFullAccess(newFuncRPC);

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

    // 👇 add route for POST /todos
    httpApi.addRoutes({
      path: "/beta/{proxy+}",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "beta-integration3",
        newFuncRPC,
        {}
      ),
    });

    new cdk.CfnOutput(this, "apiUrl", {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: httpApi.url!,
    });
    // new cdk.CfnOutput(this, "Random", {
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   value: props.table.tableName,
    // });
  }
}
