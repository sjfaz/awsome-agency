import { StackContext, ViteStaticSite } from "@serverless-stack/resources";

export function Web({ stack }: StackContext) {
  const site = new ViteStaticSite(stack, "site", {
    path: "web",
    buildCommand: "npm run build",
    environment: {
      // VITE_GRAPHQL_URL: api.url + "/graphql",
    },
  });

  stack.addOutputs({
    SITE_URL: site.url,
  });
}

// import { StaticWebsite } from "@aws-prototyping-sdk/static-website";
// import { Stack } from "aws-cdk-lib";

// const userIdentity = new UserIdentity(this, "UserIdentity");
// new StaticWebsite(this, "StaticWebsite", {
//   websiteContentPath: "<relative>/<path>/<to>/<built>/<website>",
//   runtimeOptions: {
//     jsonPayload: {
//       region: Stack.of(this).region,
//       identityPoolId: userIdentity.identityPool.identityPoolId,
//       userPoolId: userIdentity.userPool?.userPoolId,
//       userPoolWebClientId: userIdentity.userPoolClient?.userPoolClientId,
//     },
//   },
// });
