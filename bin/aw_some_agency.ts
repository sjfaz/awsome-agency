#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebStack, APIStack, DatabaseStack } from "../stacks";

const app = new cdk.App();

const db = new DatabaseStack(app, "AwSomeAgencyStackDB");
console.log("DB", db.tableName);
// new APIStack(app, "AwSomeAgencyStackAPI");
// new WebStack(app, "AwSomeAgencyStackWeb");
