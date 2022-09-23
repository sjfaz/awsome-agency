import { DocumentClient } from "aws-sdk/clients/dynamodb";

let client: DocumentClient;

export const getClient = (): DocumentClient => {
  if (client) return client;
  client = new DocumentClient({
    maxRetries: 3, // default is 10
    httpOptions: {
      connectTimeout: 1000,
      timeout: 5000,
    },
  });
  return client;
};

export type Key = {
  pk: string;
  sk?: string;
};

export type Item = Key & {
  entityType: string;
  createdDate: string;
  email: string;
  name: string;
  orderType?: string;
};
