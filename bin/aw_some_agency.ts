#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebStack, APIStack, DatabaseStack } from "../stacks";

const app = new cdk.App();

const db = new DatabaseStack(app, "AwSomeAgencyStackDB");
new APIStack(app, "AwSomeAgencyStackAPI", { table: db.table });
// new WebStack(app, "AwSomeAgencyStackWeb");
