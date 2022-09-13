import { SQSEvent, DynamoDBStreamEvent } from "aws-lambda";
import { doPostRequest } from "../core/common/messager";

exports.handler = async (event: SQSEvent) => {
  const eventBody = event.Records[0]; //Batch size 1
  await doPostRequest(JSON.stringify(eventBody));
};
