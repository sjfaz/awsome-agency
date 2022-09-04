import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { App } from "@serverless-stack/resources";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class QueueStack extends Construct {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);

    const queue = new sqs.Queue(this, "AwSomeAgencyQueue", {
      visibilityTimeout: Duration.seconds(300),
    });

    const topic = new sns.Topic(this, "AwSomeAgencyTopic");

    topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
