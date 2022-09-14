import { doPostRequest } from "../core/common/messager";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const handler = async function (event: APIGatewayProxyEventV2) {
  try {
    await doPostRequest("Simple test");
    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify(event),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify({ error }),
    };
  }
};

export { handler };
