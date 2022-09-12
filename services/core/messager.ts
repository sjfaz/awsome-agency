const https = require("https");
const reqHost = `hooks.slack.com`;

export const doPostRequest = (data: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      host: reqHost,
      path: process.env.SLACK_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    //create the request object with the callback with the result
    const req = https.request(options, (res: any) => {
      resolve(JSON.stringify(res.statusCode));
    });

    // handle the possible errors
    req.on("error", (e: any) => {
      reject(e.message);
    });

    //do the request
    req.write(JSON.stringify({ text: data }));

    //finish the request
    req.end();
  });
};
