import { DynamoDBStreamEvent } from "aws-lambda";

exports.handler = async (event: DynamoDBStreamEvent) => {
  event.Records.forEach((record) => {
    console.log("Event Id: %s", record.eventID);
    console.log("Event Id: %s", record.eventName);
    console.log("DynamoDB Record: %j", record.dynamodb);
  });
};
