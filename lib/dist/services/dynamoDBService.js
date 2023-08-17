"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBService = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
class DynamoDBService {
    constructor(tableName) {
        this.tableName = tableName;
        this.client = new client_dynamodb_1.DynamoDBClient({});
    }
    async getItem(key) {
        const response = await this.client.send(new client_dynamodb_1.GetItemCommand({
            TableName: this.tableName,
            Key: key
        }));
        return (0, util_dynamodb_1.unmarshall)(response.Item);
    }
    async putItem(item) {
        const params = {
            TableName: this.tableName,
            Item: item
        };
        return await this.client.send(new client_dynamodb_1.PutItemCommand(params));
    }
    async updateItem(key, updateExpression, expressionAttributeValues) {
        const params = {
            TableName: this.tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "UPDATED_NEW"
        };
        return await this.client.send(new client_dynamodb_1.UpdateItemCommand(params));
    }
    async deleteItem(key) {
        const params = {
            TableName: this.tableName,
            Key: key
        };
        return await this.client.send(new client_dynamodb_1.DeleteItemCommand(params));
    }
    async scan(filterExpression = undefined, expressionAttributeValues = undefined) {
        const params = {
            TableName: this.tableName,
            FilterExpression: filterExpression,
            ExpressionAttributeValues: expressionAttributeValues
        };
        const response = await this.client.send(new client_dynamodb_1.ScanCommand(params));
        return response.Items?.map(i => (0, util_dynamodb_1.unmarshall)(i));
    }
    async query(keyConditionExpression, expressionAttributeValues, indexName = undefined) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues
        };
        if (indexName) {
            params.IndexName = indexName;
        }
        const response = await this.client.send(new client_dynamodb_1.QueryCommand(params));
        return response.Items?.map(i => (0, util_dynamodb_1.unmarshall)(i));
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
        const response = await this.client.send(new client_dynamodb_1.QueryCommand(params));
        return response.Items?.map(i => (0, util_dynamodb_1.unmarshall)(i));
    }
}
exports.DynamoDBService = DynamoDBService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1vREJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZnVuY3Rpb25zL3NlcnZpY2VzL2R5bmFtb0RCU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFBeU87QUFDek8sMERBQW9EO0FBRXBELE1BQWEsZUFBZTtJQUcxQixZQUFZLFNBQWlCO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFSCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUc7UUFDYixNQUFNLFFBQVEsR0FBUSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0NBQWMsQ0FBQztZQUM1RCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxFQUFFLEdBQUc7U0FDWCxDQUFDLENBQUMsQ0FBQztRQUNKLE9BQU8sSUFBQSwwQkFBVSxFQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJO1FBQ2QsTUFBTSxNQUFNLEdBQVE7WUFDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLElBQUksRUFBRSxJQUFJO1NBQ2IsQ0FBQztRQUVGLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdDQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUseUJBQXlCO1FBQzdELE1BQU0sTUFBTSxHQUEyQjtZQUNuQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxFQUFFLEdBQUc7WUFDUixnQkFBZ0IsRUFBRSxnQkFBZ0I7WUFDbEMseUJBQXlCLEVBQUUseUJBQXlCO1lBQ3BELFlBQVksRUFBRSxhQUFhO1NBQzlCLENBQUM7UUFFRixPQUFPLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQ0FBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQVc7UUFDeEIsTUFBTSxNQUFNLEdBQVE7WUFDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLEdBQUcsRUFBRSxHQUFHO1NBQ1gsQ0FBQztRQUVGLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG1DQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxFQUFFLHlCQUF5QixHQUFHLFNBQVM7UUFDMUUsTUFBTSxNQUFNLEdBQVE7WUFDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLGdCQUFnQixFQUFFLGdCQUFnQjtZQUNsQyx5QkFBeUIsRUFBRSx5QkFBeUI7U0FDdkQsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSw2QkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDakUsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEsMEJBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFLHlCQUF5QixFQUFFLFlBQWdDLFNBQVM7UUFDcEcsTUFBTSxNQUFNLEdBQXNCO1lBQzlCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixzQkFBc0IsRUFBRSxzQkFBc0I7WUFDOUMseUJBQXlCLEVBQUUseUJBQXlCO1NBQ3ZELENBQUM7UUFFRixJQUFJLFNBQVMsRUFBRTtZQUNYLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQ2hDO1FBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLDhCQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsRSxPQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBQSwwQkFBVSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLEVBQUUsT0FBTztRQUNoRCxNQUFNLE1BQU0sR0FBUTtZQUNoQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsc0JBQXNCLEVBQUUseUNBQXlDO1lBQ2pFLHlCQUF5QixFQUFFO2dCQUN2QixTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFO2dCQUN4QixVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsZ0NBQWdDO2FBQ3pFO1NBQ0osQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSw4QkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbEUsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEsMEJBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDQTtBQXJGRCwwQ0FxRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEeW5hbW9EQkNsaWVudCwgR2V0SXRlbUNvbW1hbmQsIFB1dEl0ZW1Db21tYW5kLCBVcGRhdGVJdGVtQ29tbWFuZCwgRGVsZXRlSXRlbUNvbW1hbmQsIFNjYW5Db21tYW5kLCBRdWVyeUNvbW1hbmQsIFF1ZXJ5Q29tbWFuZElucHV0LCBVcGRhdGVJdGVtQ29tbWFuZElucHV0LCBTY2FuQ29tbWFuZE91dHB1dCwgQXR0cmlidXRlVmFsdWUgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCI7XHJcbmltcG9ydCB7IHVubWFyc2hhbGwgfSBmcm9tIFwiQGF3cy1zZGsvdXRpbC1keW5hbW9kYlwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIER5bmFtb0RCU2VydmljZSB7XHJcbiAgdGFibGVOYW1lOiBzdHJpbmc7XHJcbiAgY2xpZW50OiBEeW5hbW9EQkNsaWVudDtcclxuICBjb25zdHJ1Y3Rvcih0YWJsZU5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy50YWJsZU5hbWUgPSB0YWJsZU5hbWU7XHJcbiAgICB0aGlzLmNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7fSk7XHJcbiAgfVxyXG5cclxuYXN5bmMgZ2V0SXRlbShrZXkpIHtcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKG5ldyBHZXRJdGVtQ29tbWFuZCh7XHJcbiAgICAgICAgVGFibGVOYW1lOiB0aGlzLnRhYmxlTmFtZSxcclxuICAgICAgICBLZXk6IGtleVxyXG4gICAgfSkpO1xyXG4gICAgcmV0dXJuIHVubWFyc2hhbGwocmVzcG9uc2UuSXRlbSk7XHJcbn1cclxuXHJcbmFzeW5jIHB1dEl0ZW0oaXRlbSkge1xyXG4gICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XHJcbiAgICAgICAgVGFibGVOYW1lOiB0aGlzLnRhYmxlTmFtZSxcclxuICAgICAgICBJdGVtOiBpdGVtXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKG5ldyBQdXRJdGVtQ29tbWFuZChwYXJhbXMpKTtcclxufVxyXG5cclxuYXN5bmMgdXBkYXRlSXRlbShrZXksIHVwZGF0ZUV4cHJlc3Npb24sIGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXMpIHtcclxuICAgIGNvbnN0IHBhcmFtczogVXBkYXRlSXRlbUNvbW1hbmRJbnB1dCA9IHtcclxuICAgICAgICBUYWJsZU5hbWU6IHRoaXMudGFibGVOYW1lLFxyXG4gICAgICAgIEtleToga2V5LFxyXG4gICAgICAgIFVwZGF0ZUV4cHJlc3Npb246IHVwZGF0ZUV4cHJlc3Npb24sXHJcbiAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczogZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyxcclxuICAgICAgICBSZXR1cm5WYWx1ZXM6IFwiVVBEQVRFRF9ORVdcIlxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnQuc2VuZChuZXcgVXBkYXRlSXRlbUNvbW1hbmQocGFyYW1zKSk7XHJcbn1cclxuXHJcbmFzeW5jIGRlbGV0ZUl0ZW0oa2V5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHBhcmFtczogYW55ID0ge1xyXG4gICAgICAgIFRhYmxlTmFtZTogdGhpcy50YWJsZU5hbWUsXHJcbiAgICAgICAgS2V5OiBrZXlcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xpZW50LnNlbmQobmV3IERlbGV0ZUl0ZW1Db21tYW5kKHBhcmFtcykpO1xyXG59XHJcblxyXG5hc3luYyBzY2FuKGZpbHRlckV4cHJlc3Npb24gPSB1bmRlZmluZWQsIGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXMgPSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnN0IHBhcmFtczogYW55ID0ge1xyXG4gICAgICAgIFRhYmxlTmFtZTogdGhpcy50YWJsZU5hbWUsXHJcbiAgICAgICAgRmlsdGVyRXhwcmVzc2lvbjogZmlsdGVyRXhwcmVzc2lvbixcclxuICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5jbGllbnQuc2VuZChuZXcgU2NhbkNvbW1hbmQocGFyYW1zKSk7XHJcbiAgICByZXR1cm4gcmVzcG9uc2UuSXRlbXM/Lm1hcChpID0+IHVubWFyc2hhbGwoaSkpO1xyXG59XHJcblxyXG5hc3luYyBxdWVyeShrZXlDb25kaXRpb25FeHByZXNzaW9uLCBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzLCBpbmRleE5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xyXG4gICAgY29uc3QgcGFyYW1zOiBRdWVyeUNvbW1hbmRJbnB1dCA9IHtcclxuICAgICAgICBUYWJsZU5hbWU6IHRoaXMudGFibGVOYW1lLFxyXG4gICAgICAgIEtleUNvbmRpdGlvbkV4cHJlc3Npb246IGtleUNvbmRpdGlvbkV4cHJlc3Npb24sXHJcbiAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczogZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlc1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoaW5kZXhOYW1lKSB7XHJcbiAgICAgICAgcGFyYW1zLkluZGV4TmFtZSA9IGluZGV4TmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuY2xpZW50LnNlbmQobmV3IFF1ZXJ5Q29tbWFuZChwYXJhbXMpKTtcclxuICAgIHJldHVybiByZXNwb25zZS5JdGVtcz8ubWFwKGkgPT4gdW5tYXJzaGFsbChpKSk7XHJcbn1cclxuXHJcbmFzeW5jIGdldEl0ZW1zV2l0aFZlcnNpb25HcmVhdGVyVGhhbihmaWxlSWQsIHZlcnNpb24pIHtcclxuICAgIGNvbnN0IHBhcmFtczogYW55ID0ge1xyXG4gICAgICAgIFRhYmxlTmFtZTogdGhpcy50YWJsZU5hbWUsXHJcbiAgICAgICAgS2V5Q29uZGl0aW9uRXhwcmVzc2lvbjogXCJmaWxlSWQgPSA6ZmlsZUlkIEFORCB2ZXJzaW9uID4gOnZlcnNpb25cIixcclxuICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XHJcbiAgICAgICAgICAgIFwiOmZpbGVJZFwiOiB7IFM6IGZpbGVJZCB9LFxyXG4gICAgICAgICAgICBcIjp2ZXJzaW9uXCI6IHsgTjogdmVyc2lvbi50b1N0cmluZygpIH0gLy9UT0RPOiB0byBjaGVjayBpZiBpdCBpcyBudW1iZXJcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5jbGllbnQuc2VuZChuZXcgUXVlcnlDb21tYW5kKHBhcmFtcykpO1xyXG4gICAgcmV0dXJuIHJlc3BvbnNlLkl0ZW1zPy5tYXAoaSA9PiB1bm1hcnNoYWxsKGkpKTtcclxufVxyXG59XHJcbiJdfQ==