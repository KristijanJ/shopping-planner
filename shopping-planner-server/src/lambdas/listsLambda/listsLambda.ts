import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { ShopListItemInterface } from "../../../services/definitions/Shopping";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const getUsername = async (authToken: string) => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID!,
    tokenUse: "id",
    clientId: process.env.COGNITO_CLIENT_ID!,
  });

  try {
    const payload = await verifier.verify(authToken);
    return payload["cognito:username"];
  } catch {
    return "";
  }
};

const getLists = async (username: string) => {
  const command = new QueryCommand({
    TableName: process.env.LISTS_TABLE_NAME,
    IndexName: "usernameKey",
    KeyConditionExpression: "username = :u",
    ExpressionAttributeValues: {
      ":u": { S: username },
    },
  });

  const body = await docClient.send(command);

  const response = body.Items?.map((item) => {
    return unmarshall(item);
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: defaultHeaders,
  };
};

const getList = async (listId: string, username: string) => {
  const command = new QueryCommand({
    TableName: process.env.LISTS_TABLE_NAME,
    IndexName: "usernameKey",
    KeyConditionExpression: "username = :u AND listId = :lid",
    ExpressionAttributeValues: {
      ":u": { S: username },
      ":lid": { S: listId },
    },
  });

  const body = await docClient.send(command);

  if (!body.Items?.[0]) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error: `No list found with id: ${listId}` }),
      headers: defaultHeaders,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(unmarshall(body.Items?.[0])),
    headers: defaultHeaders,
  };
};

const addOrUpdateList = async (
  body: string,
  username: string,
  existingListId?: string
) => {
  const list = JSON.parse(body) as ShopListItemInterface;
  const listId = existingListId || list.listId;

  if (!listId || !list.title) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Invalid list" }),
      headers: defaultHeaders,
    };
  }

  const Item: ShopListItemInterface = {
    listId: list.listId,
    title: list.title,
    username: username,
    items: [],
  };

  for (let i = 0; i < list.items.length; i++) {
    const item = list.items[i];

    if (!item.itemId || !item.title) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid item in list" }),
        headers: defaultHeaders,
      };
    }

    Item.items.push(item);
  }

  const command = new PutCommand({
    TableName: process.env.LISTS_TABLE_NAME,
    Item: Item,
  });

  await docClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: existingListId ? "List updated" : "List added",
    }),
    headers: defaultHeaders,
  };
};

const deleteList = async (listId: string) => {
  const command = new DeleteCommand({
    TableName: process.env.LISTS_TABLE_NAME,
    Key: {
      listId: listId,
    },
  });

  await docClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "List deleted",
    }),
    headers: defaultHeaders,
  };
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log("------- EVENT -------", event);

  if (!event.headers.Authorization) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Invalid authorization" }),
      headers: defaultHeaders,
    };
  }

  const authToken = event.headers.Authorization.replace("Bearer ", "");
  let username = await getUsername(authToken);
  if (!username) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Token not valid" }),
      headers: defaultHeaders,
    };
  }

  try {
    if (event.path === "/lists") {
      return await getLists(username);
    }

    if (event.path === "/list/new") {
      if (!event.body) {
        throw new Error("Please provide an item body");
      }
      return await addOrUpdateList(event.body, username);
    }

    if (event.path.includes("/list/")) {
      const listId = event.path.replace("/list/", "");
      if (!listId) {
        throw new Error("Invalid list id");
      }

      if (event.httpMethod === "GET") {
        return await getList(listId, username);
      }

      if (event.httpMethod === "POST") {
        if (!event.body) {
          throw new Error("Please provide an item body");
        }

        return await addOrUpdateList(event.body, username, listId);
      }

      if (event.httpMethod === "DELETE") {
        return await deleteList(listId);
      }
    }

    throw new Error("Invalid route");
  } catch (error: any) {
    const response: APIGatewayProxyResult = {
      statusCode: 500,
      body: JSON.stringify({ error: error?.message }),
      headers: defaultHeaders,
    };

    return response;
  }
};
