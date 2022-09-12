import * as trpc from "@trpc/server";
import { Order } from "../core/accounts/order";
import { z } from "zod";

// export type definition of API
export type AppRouter = typeof appRouter;

const appRouter = trpc
  .router()
  .query("getOrders", {
    input: z.string(),
    async resolve(req) {
      // Take email and get Orders from DB
      const items = await Order.getOrders(req.input);
      return items;
    },
  })
  .mutation("createOrder", {
    input: z.object({
      name: z.string(),
      email: z.string(),
      orderType: z.string(),
    }),
    async resolve(req) {
      // Write to DB
      const date = new Date().toISOString();
      const item = {
        pk: req.input.email,
        sk: `Order#${date}`,
        createdDate: date,
        entityType: "Order",
        name: req.input.name,
        email: req.input.email,
        orderType: req.input.orderType,
      };
      const order = await Order.putOrder(item);
      return order;
    },
  });

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
