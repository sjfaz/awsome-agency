// From https://docs.aws.amazon.com/cdk/latest/guide/serverless_example.html
const handler = async function (event: any, context: any) {
  try {
    // var method = event.httpMethod;

    //if (method === "GET") {
    //const body = { message: "Hello World!" };
    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify(event),
    };
    //}

    // We only accept GET for now
    // return {
    //   statusCode: 400,
    //   headers: {},
    //   body: "We only accept GET /",
    // };
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
