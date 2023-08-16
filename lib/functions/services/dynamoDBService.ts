import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, QueryCommand, QueryCommandInput, UpdateItemCommandInput, ScanCommandOutput, AttributeValue } from "@aws-sdk/client-dynamodb";

export class DynamoDBService {
  tableName: string;
  client: DynamoDBClient;
  constructor(tableName: string) {
    this.tableName = tableName;
    this.client = new DynamoDBClient({});
  }

async getItem(key) {
    const response = await this.client.send(new GetItemCommand({
        TableName: this.tableName,
        Key: key
    }));
    return response.Item;
}

async putItem(item) {
    const params: any = {
        TableName: this.tableName,
        Item: item
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

async deleteItem(key: string) {
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
    return response.Items;
}

async query(keyConditionExpression, expressionAttributeValues, indexName: string | undefined = undefined) {
    const params: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    if (indexName) {
        params.IndexName = indexName;
    }

    const response = await this.client.send(new QueryCommand(params));
    return response.Items;
}

async getItemsWithVersionGreaterThan(fileId, version) {
    const params: any = {
        TableName: this.tableName,
        KeyConditionExpression: "fileId = :fileId AND version > :version",
        ExpressionAttributeValues: {
            ":fileId": { S: fileId },
            ":version": { N: version.toString() } //TODO: to check if it is number
        }
    };

    const response = await this.client.send(new QueryCommand(params));
    return response.Items;
}
}
