import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { BaseDynamoDB } from "./BaseDynamoDB";

export class FileMetadataDynamoDB extends BaseDynamoDB {
  
  constructor(tableName: string) {
    super(tableName);
  }

  async query(fileId: string, version?: number, indexName?: string): Promise<any[] | undefined> {
    let keyConditionExpression = "fileId = :fileId";
    let expressionAttributeValues: { [key: string]: AttributeValue } = {
        ":fileId": { S: fileId }
    };

    if (version !== undefined) {
        keyConditionExpression += " AND version > :version";
        expressionAttributeValues[":version"] = { N: version.toString() };
    }

    const params: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    if (indexName) {
        params.IndexName = indexName;
    }

    try {
        const response = await this.client.send(new QueryCommand(params));
        return response.Items?.map(i => unmarshall(i));
    } catch (error) {
        console.error("Error during DynamoDB query:", error);
        throw error;
    }
  }

  async getItemsWithVersionGreaterThan(fileId: string, version: number) {
    const params: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: "fileId = :fileId AND version > :version",
        ExpressionAttributeValues: {
            ":fileId": { S: fileId },
            ":version": { N: version.toString() }
        }
    };

    const response = await this.client.send(new QueryCommand(params));
    return response.Items?.map(i => unmarshall(i));
  }


}
