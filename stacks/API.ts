import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { StackProps, Stack, Duration, CfnOutput, aws_ssm } from "aws-cdk-lib";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { lambdaFnProps } from "./utils";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface LambdaApiStackProps extends StackProps {
  table: ITable;
}

export class LambdaApiStack extends Construct {
  constructor(parent: Stack, name: string, props: LambdaApiStackProps) {
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
      timeout: Duration.seconds(30),
      environment: {
        SLACK_URL: aws_ssm.StringParameter.valueForStringParameter(
          this,
          "/awesome-agency/slack-url"
        ),
      },
    });

    const newFuncRPC = new NodejsFunction(this, "GetRPC", {
      ...lambdaFnProps,
      entry: "./services/functions/tRPC.ts", // accepts .js, .jsx, .ts and .tsx files
      functionName: "tRPC",
      handler: "handler",
      memorySize: 512,
      environment: { TABLE_NAME: props.table.tableName },
      timeout: Duration.seconds(30),
    });

    props.table.grantFullAccess(newFuncRPC);

    // Add route for GET /todos
    httpApi.addRoutes({
      path: "/simple",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration("beta-integration", newFunc),
    });

    // Add route for GET /todos
    httpApi.addRoutes({
      path: "/beta/{proxy+}",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration("beta-integration2", newFuncRPC),
    });

    // Add route for POST /todos
    httpApi.addRoutes({
      path: "/beta/{proxy+}",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "beta-integration3",
        newFuncRPC,
        {}
      ),
    });

    new CfnOutput(this, "apiUrl", {
      value: httpApi.url!,
    });
  }
}
