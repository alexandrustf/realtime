import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, QueryCommand, QueryCommandInput, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class BaseDynamoDB {
  tableName: string;
  client: DynamoDBClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.client = new DynamoDBClient({});
  }

  async getItem(key) {
    const response: any = await this.client.send(new GetItemCommand({
        TableName: this.tableName,
        Key: key
    }));
    return unmarshall(response.Item);
  }

  async putItem(item: Record<string, any>) {
    const params: any = {
        TableName: this.tableName,
        Item: marshall(item)
    };

    return await this.client.send(new PutItemCommand(params));
  }

  async updateItem(key, updateExpression, expressionAttributeValues) {
    const params: UpdateItemCommandInput = {
        TableName: this.tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "UPDATED_NEW"
    };

    return await this.client.send(new UpdateItemCommand(params));
  }

  async deleteItem(key: string) { // this will not work
    const params: any = {
        TableName: this.tableName,
        Key: key
    };

    return await this.client.send(new DeleteItemCommand(params));
  }

  async scan(filterExpression = undefined, expressionAttributeValues = undefined) {
    const params: any = {
        TableName: this.tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    const response = await this.client.send(new ScanCommand(params));
    return response.Items?.map(i => unmarshall(i));
  }

  async query(keyConditionExpression, expressionAttributeValues, indexName: string | undefined = undefined) {
    console.log("query");
    const params: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    console.log({params});

    if (indexName) {
        params.IndexName = indexName;
    }

    const response = await this.client.send(new QueryCommand(params));
    console.log(response)
    return response.Items?.map(i => unmarshall(i));
  }
}
