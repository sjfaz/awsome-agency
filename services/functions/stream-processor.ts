import { DynamoDBStreamEvent } from "aws-lambda";
var AWS = require("aws-sdk");
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

exports.handler = async (event: DynamoDBStreamEvent) => {
  try {
    for (const record of event.Records) {
      console.log("DynamoDB Record: %j", record.dynamodb);
      var params = {
        // DelaySeconds: 1,
        MessageBody: JSON.stringify(record),
        QueueUrl: process.env.QUEUE_URL,
      };
      await sqs.sendMessage(params).promise();
    }
  } catch (error) {
    console.log(`Error processiong stream: ${error}`);
  }
};
