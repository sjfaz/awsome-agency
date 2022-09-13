import { getClient, Key, Item } from "../common/client";

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
