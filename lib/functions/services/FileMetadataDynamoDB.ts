import { unmarshall } from "@aws-sdk/util-dynamodb";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { BaseDynamoDB } from "./BaseDynamoDB";

export class FileMetadataDynamoDB extends BaseDynamoDB {
  
  constructor(tableName: string) {
    super(tableName);
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
