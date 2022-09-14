import https from "https";
import http from "http";
const reqHost = `hooks.slack.com`;

export const doPostRequest = (data: string) => {
  return new Promise((resolve, reject) => {
    if (!process.env.SLACK_URL) {
      reject();
    }
    // Make sure we only have the path
    const path = process.env.SLACK_URL?.replace(reqHost, "").replace(
      "https://",
      ""
    );
    const options = {
      host: reqHost,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    //create the request object with the callback with the result
    const req = https.request(options, (res: http.IncomingMessage) => {
      resolve(JSON.stringify(res.statusCode));
    });

    // handle the possible errors
    req.on("error", (e: Error) => {
      reject(e.message);
    });

    //do the request
    req.write(JSON.stringify({ text: data }));

    //finish the request
    req.end();
  });
};
