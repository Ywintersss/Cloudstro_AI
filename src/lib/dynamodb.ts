import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_DYNAMODB_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy-secret-key',
  },
});

// Document client for working with plain JS objects
export const ddbDocClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});
