import { FastifyPluginAsync } from "fastify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoConfig } from "../utils";
import { handleError } from "../utils/errorUtils";

const client = new DynamoDBClient(dynamoConfig());
const dynamodb = DynamoDBDocumentClient.from(client);

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.delete("/products/:productId", async function (request, reply) {
    const { productId } = request.params as { productId: "string" };

    try {
      console.log("productId: ", productId);
      const command = new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: productId },
        ConditionExpression: "attribute_exists(id)",
      });

      await dynamodb.send(command);

      return reply.status(200).send({
        message: `Product with ID ${productId} has been successfully deleted`,
      });
    } catch (error) {
      const { message, statusCode } = handleError(error);

      if (statusCode === 404) {
        return reply.status(404).send({ error: message });
      }

      console.error("Error deleting product:", error);
      reply.status(statusCode).send({ error: message });
    }
  });
};

export default root;
