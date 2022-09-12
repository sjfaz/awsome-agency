import { doPostRequest } from "../core/messager";

const handler = async function (event: any, context: any) {
  try {
    await doPostRequest("Simple test");
    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify(event),
    };
  } catch (error) {
    let body;
    if (error instanceof Error) {
      body = error.stack;
    } else {
      body = JSON.stringify(error, null, 2);
    }
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify(body),
    };
  }
};

export { handler };
