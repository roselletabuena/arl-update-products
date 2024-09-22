import { FastifyPluginAsync } from "fastify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoConfig } from "../utils";
import { Product } from "../models/productInterfaces";

const client = new DynamoDBClient(dynamoConfig());
const dynamodb = DynamoDBDocumentClient.from(client);

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.put("/products/:productId", async function (request, reply) {
    const { productId } = request.params as { productId: "string" };

    const data = request.body as Product;

    try {
      const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: productId, productId: data.productId },
        UpdateExpression: "SET #name = :name",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": data.name,
        },
        ReturnValues: "ALL_NEW",
      });

      const response = await dynamodb.send(command);

      return reply.status(200).send({ updatedProduct: response.Attributes });
    } catch (error) {
      console.error("Error updating product:", error);
      reply
        .status(500)
        .send({ error: "Failed to update product", productId: productId });
    }
  });
};

export default root;
