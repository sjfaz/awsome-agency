import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaApiStack } from "./API";
import { StaticSite } from "./Web";
import { Database } from "./Database";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

export class DatabaseStack extends Stack {
  public readonly table: ITable;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const db = new Database(this, "Database", {});
    this.table = db.table;
  }
}

interface APIProps extends StackProps {
  table: ITable;
}

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props: APIProps) {
    super(scope, id, props);

    new LambdaApiStack(this, "API", { table: props.table });
  }
}

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new StaticSite(this, "StaticSite", {});
  }
}
