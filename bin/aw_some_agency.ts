#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
// import { App } from "@serverless-stack/resources";
import { WebStack } from "../stacks";
import { APIStack } from "../stacks";

// export default function main(app: App) {
//     app.setDefaultFunctionProps({
//       runtime: "nodejs16.x",
//       srcPath: "services",
//       bundle: {
//         format: "esm"
//       }
//     });
//     app
//       .stack(Database)
//       .stack(Api)
//       .stack(Web);
//   }

const app = new cdk.App();
// new WebStack(app, "AwSomeAgencyStackWeb");
new APIStack(app, "AwSomeAgencyStackAPI");
