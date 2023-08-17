import { unmarshall } from "@aws-sdk/util-dynamodb";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { BaseDynamoDB } from "./BaseDynamoDB";

export class UserSubscribedDynamoDB extends BaseDynamoDB {
  
  constructor(tableName: string) {
    super(tableName);
  }

  async subscribeUserToFile(userId: string, fileId: string) {
    const subscription = {
      userId: { S: userId },
      fileId: { S: fileId }
    };

    return await this.putItem(subscription);
  }

  async isUserSubscribedToFile(userId: string, fileId: string) {
    const params: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: "userId = :userId AND fileId = :fileId",
        ExpressionAttributeValues: {
            ":userId": { S: userId },
            ":fileId": { S: fileId }
        }
    };

    const response = await this.client.send(new QueryCommand(params));
    const items = response.Items?.map(i => unmarshall(i));
    return (items && items.length > 0);
  }

}
