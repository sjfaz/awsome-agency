import { SQSEvent, DynamoDBStreamEvent, DynamoDBRecord } from "aws-lambda";
import { doPostRequest } from "../core/common/messager";

exports.handler = async (event: SQSEvent) => {
  try {
    const eventBody = event.Records[0]; //Batch size 1
    const body = JSON.parse(eventBody.body) as DynamoDBRecord;
    const newImage = body.dynamodb?.NewImage;
    const eventType = body.eventName;
    if (eventType === "INSERT") {
      if (!newImage) {
        throw new Error("No new image found");
      } else {
        await doPostRequest(`New order from: ${newImage.email.S}`);
      }
    }
  } catch (error) {
    await doPostRequest(JSON.stringify("Error: " + error));
  }
};
