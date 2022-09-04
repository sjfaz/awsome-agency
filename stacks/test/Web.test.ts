import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as AwSomeAgency from "..";

test("S3 Bucket is created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwSomeAgency.WebStack(app, "MyTestStack");
  // THEN

  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::S3::Bucket", 1);
});
