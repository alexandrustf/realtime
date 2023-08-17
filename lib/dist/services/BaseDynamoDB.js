"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDynamoDB = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
class BaseDynamoDB {
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
            Item: (0, util_dynamodb_1.marshall)(item)
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
        console.log("query");
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues
        };
        console.log({ params });
        if (indexName) {
            params.IndexName = indexName;
        }
        const response = await this.client.send(new client_dynamodb_1.QueryCommand(params));
        console.log(response);
        return response.Items?.map(i => (0, util_dynamodb_1.unmarshall)(i));
    }
}
exports.BaseDynamoDB = BaseDynamoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUR5bmFtb0RCLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZnVuY3Rpb25zL3NlcnZpY2VzL0Jhc2VEeW5hbW9EQi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFBc007QUFDdE0sMERBQThEO0FBRTlELE1BQWEsWUFBWTtJQUl2QixZQUFZLFNBQWlCO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUc7UUFDZixNQUFNLFFBQVEsR0FBUSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0NBQWMsQ0FBQztZQUM1RCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxFQUFFLEdBQUc7U0FDWCxDQUFDLENBQUMsQ0FBQztRQUNKLE9BQU8sSUFBQSwwQkFBVSxFQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUF5QjtRQUNyQyxNQUFNLE1BQU0sR0FBUTtZQUNoQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsSUFBSSxFQUFFLElBQUEsd0JBQVEsRUFBQyxJQUFJLENBQUM7U0FDdkIsQ0FBQztRQUVGLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdDQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUseUJBQXlCO1FBQy9ELE1BQU0sTUFBTSxHQUEyQjtZQUNuQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxFQUFFLEdBQUc7WUFDUixnQkFBZ0IsRUFBRSxnQkFBZ0I7WUFDbEMseUJBQXlCLEVBQUUseUJBQXlCO1lBQ3BELFlBQVksRUFBRSxhQUFhO1NBQzlCLENBQUM7UUFFRixPQUFPLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQ0FBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQVc7UUFDMUIsTUFBTSxNQUFNLEdBQVE7WUFDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLEdBQUcsRUFBRSxHQUFHO1NBQ1gsQ0FBQztRQUVGLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG1DQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxFQUFFLHlCQUF5QixHQUFHLFNBQVM7UUFDNUUsTUFBTSxNQUFNLEdBQVE7WUFDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLGdCQUFnQixFQUFFLGdCQUFnQjtZQUNsQyx5QkFBeUIsRUFBRSx5QkFBeUI7U0FDdkQsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSw2QkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDakUsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEsMEJBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFLHlCQUF5QixFQUFFLFlBQWdDLFNBQVM7UUFDdEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQixNQUFNLE1BQU0sR0FBc0I7WUFDOUIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLHNCQUFzQixFQUFFLHNCQUFzQjtZQUM5Qyx5QkFBeUIsRUFBRSx5QkFBeUI7U0FDdkQsQ0FBQztRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBRXRCLElBQUksU0FBUyxFQUFFO1lBQ1gsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7U0FDaEM7UUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksOEJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDckIsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEsMEJBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDRjtBQTVFRCxvQ0E0RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEeW5hbW9EQkNsaWVudCwgR2V0SXRlbUNvbW1hbmQsIFB1dEl0ZW1Db21tYW5kLCBVcGRhdGVJdGVtQ29tbWFuZCwgRGVsZXRlSXRlbUNvbW1hbmQsIFNjYW5Db21tYW5kLCBRdWVyeUNvbW1hbmQsIFF1ZXJ5Q29tbWFuZElucHV0LCBVcGRhdGVJdGVtQ29tbWFuZElucHV0IH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiO1xyXG5pbXBvcnQgeyBtYXJzaGFsbCwgdW5tYXJzaGFsbCB9IGZyb20gXCJAYXdzLXNkay91dGlsLWR5bmFtb2RiXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmFzZUR5bmFtb0RCIHtcclxuICB0YWJsZU5hbWU6IHN0cmluZztcclxuICBjbGllbnQ6IER5bmFtb0RCQ2xpZW50O1xyXG5cclxuICBjb25zdHJ1Y3Rvcih0YWJsZU5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy50YWJsZU5hbWUgPSB0YWJsZU5hbWU7XHJcbiAgICB0aGlzLmNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7fSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRJdGVtKGtleSkge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IGFueSA9IGF3YWl0IHRoaXMuY2xpZW50LnNlbmQobmV3IEdldEl0ZW1Db21tYW5kKHtcclxuICAgICAgICBUYWJsZU5hbWU6IHRoaXMudGFibGVOYW1lLFxyXG4gICAgICAgIEtleToga2V5XHJcbiAgICB9KSk7XHJcbiAgICByZXR1cm4gdW5tYXJzaGFsbChyZXNwb25zZS5JdGVtKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHB1dEl0ZW0oaXRlbTogUmVjb3JkPHN0cmluZywgYW55Pikge1xyXG4gICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XHJcbiAgICAgICAgVGFibGVOYW1lOiB0aGlzLnRhYmxlTmFtZSxcclxuICAgICAgICBJdGVtOiBtYXJzaGFsbChpdGVtKVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jbGllbnQuc2VuZChuZXcgUHV0SXRlbUNvbW1hbmQocGFyYW1zKSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyB1cGRhdGVJdGVtKGtleSwgdXBkYXRlRXhwcmVzc2lvbiwgZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcykge1xyXG4gICAgY29uc3QgcGFyYW1zOiBVcGRhdGVJdGVtQ29tbWFuZElucHV0ID0ge1xyXG4gICAgICAgIFRhYmxlTmFtZTogdGhpcy50YWJsZU5hbWUsXHJcbiAgICAgICAgS2V5OiBrZXksXHJcbiAgICAgICAgVXBkYXRlRXhwcmVzc2lvbjogdXBkYXRlRXhwcmVzc2lvbixcclxuICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzLFxyXG4gICAgICAgIFJldHVyblZhbHVlczogXCJVUERBVEVEX05FV1wiXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKG5ldyBVcGRhdGVJdGVtQ29tbWFuZChwYXJhbXMpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGRlbGV0ZUl0ZW0oa2V5OiBzdHJpbmcpIHsgLy8gdGhpcyB3aWxsIG5vdCB3b3JrXHJcbiAgICBjb25zdCBwYXJhbXM6IGFueSA9IHtcclxuICAgICAgICBUYWJsZU5hbWU6IHRoaXMudGFibGVOYW1lLFxyXG4gICAgICAgIEtleToga2V5XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKG5ldyBEZWxldGVJdGVtQ29tbWFuZChwYXJhbXMpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNjYW4oZmlsdGVyRXhwcmVzc2lvbiA9IHVuZGVmaW5lZCwgZXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlcyA9IHVuZGVmaW5lZCkge1xyXG4gICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XHJcbiAgICAgICAgVGFibGVOYW1lOiB0aGlzLnRhYmxlTmFtZSxcclxuICAgICAgICBGaWx0ZXJFeHByZXNzaW9uOiBmaWx0ZXJFeHByZXNzaW9uLFxyXG4gICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXNcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKG5ldyBTY2FuQ29tbWFuZChwYXJhbXMpKTtcclxuICAgIHJldHVybiByZXNwb25zZS5JdGVtcz8ubWFwKGkgPT4gdW5tYXJzaGFsbChpKSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBxdWVyeShrZXlDb25kaXRpb25FeHByZXNzaW9uLCBleHByZXNzaW9uQXR0cmlidXRlVmFsdWVzLCBpbmRleE5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJxdWVyeVwiKTtcclxuICAgIGNvbnN0IHBhcmFtczogUXVlcnlDb21tYW5kSW5wdXQgPSB7XHJcbiAgICAgICAgVGFibGVOYW1lOiB0aGlzLnRhYmxlTmFtZSxcclxuICAgICAgICBLZXlDb25kaXRpb25FeHByZXNzaW9uOiBrZXlDb25kaXRpb25FeHByZXNzaW9uLFxyXG4gICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IGV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXNcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coe3BhcmFtc30pO1xyXG5cclxuICAgIGlmIChpbmRleE5hbWUpIHtcclxuICAgICAgICBwYXJhbXMuSW5kZXhOYW1lID0gaW5kZXhOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5jbGllbnQuc2VuZChuZXcgUXVlcnlDb21tYW5kKHBhcmFtcykpO1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuSXRlbXM/Lm1hcChpID0+IHVubWFyc2hhbGwoaSkpO1xyXG4gIH1cclxufVxyXG4iXX0=