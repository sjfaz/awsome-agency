import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { NodejsFunctionProps, LogLevel } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";

export const lambdaFnProps: Partial<NodejsFunctionProps> = {
  bundling: {
    target: "es2020",
    keepNames: true,
    logLevel: LogLevel.INFO,
    sourceMap: true,
    minify: true,
  },
  runtime: lambda.Runtime.NODEJS_16_X,
  timeout: Duration.seconds(30),
  memorySize: 512,
  logRetention: RetentionDays.ONE_DAY,
  environment: {
    NODE_OPTIONS: "--enable-source-maps",
  },
};
