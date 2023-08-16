import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";

export class DynamoDBService {
  tableName: string;
  client: DynamoDBClient;
  constructor(tableName: string) {
    this.tableName = tableName;
    this.client = new DynamoDBClient({});
  }

async getItem(key: string) {
    const params = {
        TableName: this.tableName,
        Key: key
    };

    const response = await this.client.send(new GetItemCommand(params));
    return response.Item;
}

async putItem(item) {
    const params = {
        TableName: this.tableName,
        Item: item
    };

    return await this.client.send(new PutItemCommand(params));
}

async updateItem(key: string, updateExpression, expressionAttributeValues) {
    const params = {
        TableName: this.tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "UPDATED_NEW"
    };

    return await this.client.send(new UpdateItemCommand(params));
}

async deleteItem(key: string) {
    const params = {
        TableName: this.tableName,
        Key: key
    };

    return await this.client.send(new DeleteItemCommand(params));
}

async scan(filterExpression, expressionAttributeValues) {
    const params = {
        TableName: this.tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    const response = await this.client.send(new ScanCommand(params));
    return response.Items;
}

async query(keyConditionExpression, expressionAttributeValues, indexName = null) {
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
    const params = {
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
