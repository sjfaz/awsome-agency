import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaApiStack } from "./API";
import { StaticSite } from "./Web";
import { Database } from "./Database";

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new StaticSite(this, "StaticSite", {});
  }
}

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new LambdaApiStack(this, "StaticSite", { functionName: "my-new-function" });
  }
}

export class DatabaseStack extends Stack {
  public readonly tableName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const db = new Database(this, "Database", {});
    this.tableName = db.tableName;
  }
}
