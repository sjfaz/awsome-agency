import * as trpc from "@trpc/server";
import { z } from "zod";

// export type definition of API
export type AppRouter = typeof appRouter;

const appRouter = trpc
  .router()
  .query("getUser", {
    input: z.string(),
    async resolve(req) {
      req.input; // string
      return { id: req.input, name: "Bilbo" };
    },
  })
  .mutation("createUser", {
    input: z.object({
      title: z.string(),
    }),
    async resolve(req) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return {
        id: "1",
        title: req.input.title,
      };
    },
  });

// // created for each request
// const createContext = ({
//   event,
//   context,
// }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) => ({}); // no context
// //type Context = trpc.inferAsyncReturnType<typeof createContext>;

const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) => {
  return {
    user: "foo",
    tenant: "blah",
  };
}; // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

import {
  awsLambdaRequestHandler,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
