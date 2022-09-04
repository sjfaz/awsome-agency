import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaApiStack } from "./API";
import { StaticSite } from "./Web";

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // new QueueStack(this, "QueueStack");
    new StaticSite(this, "StaticSite", {});
  }
}

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new LambdaApiStack(this, "StaticSite", { functionName: "my-new-function" });
  }
}
