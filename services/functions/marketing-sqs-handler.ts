import { SQSEvent, DynamoDBRecord } from "aws-lambda";
import { sendPromotionMessage } from "../core/marketing/promotion";

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
        await sendPromotionMessage(
          `New order from: ${newImage.email.S} at ${newImage.createdDate.S}`
        );
      }
    }
  } catch (error) {
    console.log(`Error processing SQS: ${error}`);
  }
};
