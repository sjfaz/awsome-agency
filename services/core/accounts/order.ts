import { getClient, Key, Item } from "../client";

const params = {
  TableName: process.env.TABLE_NAME ?? "Table",
};

var queryParams = {
  ...params,
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: { ":pk": "pk" },
  ReturnValues: "ALL_NEW",
};

async function putOrder(item: Item) {
  const res = getClient()
    .put({ ...params, Item: item })
    .promise();
  return res;
}

// async function getOrder(key: Key) {
//   const res = getClient()
//     .get({ ...params, Key: key })
//     .promise();
//   return res;
// }

async function getOrders(email: string) {
  const res = getClient()
    .query({ ...queryParams, ExpressionAttributeValues: { ":pk": email } })
    .promise();
  return res;
}

export const Order = {
  putOrder,
  getOrders,
};
