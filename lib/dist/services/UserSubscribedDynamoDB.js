"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscribedDynamoDB = void 0;
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const BaseDynamoDB_1 = require("./BaseDynamoDB");
class UserSubscribedDynamoDB extends BaseDynamoDB_1.BaseDynamoDB {
    constructor(tableName) {
        super(tableName);
    }
    async subscribeUserToFile(userId, fileId) {
        const subscription = {
            userId: { S: userId },
            fileId: { S: fileId }
        };
        return await this.putItem(subscription);
    }
    async isUserSubscribedToFile(userId, fileId) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: "userId = :userId AND fileId = :fileId",
            ExpressionAttributeValues: {
                ":userId": { S: userId },
                ":fileId": { S: fileId }
            }
        };
        const response = await this.client.send(new client_dynamodb_1.QueryCommand(params));
        const items = response.Items?.map(i => (0, util_dynamodb_1.unmarshall)(i));
        return (items && items.length > 0);
    }
}
exports.UserSubscribedDynamoDB = UserSubscribedDynamoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclN1YnNjcmliZWREeW5hbW9EQi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2Z1bmN0aW9ucy9zZXJ2aWNlcy9Vc2VyU3Vic2NyaWJlZER5bmFtb0RCLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBEQUFvRDtBQUNwRCw4REFBMkU7QUFDM0UsaURBQThDO0FBRTlDLE1BQWEsc0JBQXVCLFNBQVEsMkJBQVk7SUFFdEQsWUFBWSxTQUFpQjtRQUMzQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFjLEVBQUUsTUFBYztRQUN0RCxNQUFNLFlBQVksR0FBRztZQUNuQixNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFO1lBQ3JCLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7U0FDdEIsQ0FBQztRQUVGLE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBYyxFQUFFLE1BQWM7UUFDekQsTUFBTSxNQUFNLEdBQXNCO1lBQzlCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixzQkFBc0IsRUFBRSx1Q0FBdUM7WUFDL0QseUJBQXlCLEVBQUU7Z0JBQ3ZCLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7Z0JBQ3hCLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7YUFDM0I7U0FDSixDQUFDO1FBRUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLDhCQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsRSxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEsMEJBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBRUY7QUE5QkQsd0RBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdW5tYXJzaGFsbCB9IGZyb20gXCJAYXdzLXNkay91dGlsLWR5bmFtb2RiXCI7XHJcbmltcG9ydCB7IFF1ZXJ5Q29tbWFuZCwgUXVlcnlDb21tYW5kSW5wdXQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCI7XHJcbmltcG9ydCB7IEJhc2VEeW5hbW9EQiB9IGZyb20gXCIuL0Jhc2VEeW5hbW9EQlwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJTdWJzY3JpYmVkRHluYW1vREIgZXh0ZW5kcyBCYXNlRHluYW1vREIge1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHRhYmxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcih0YWJsZU5hbWUpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc3Vic2NyaWJlVXNlclRvRmlsZSh1c2VySWQ6IHN0cmluZywgZmlsZUlkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHtcclxuICAgICAgdXNlcklkOiB7IFM6IHVzZXJJZCB9LFxyXG4gICAgICBmaWxlSWQ6IHsgUzogZmlsZUlkIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMucHV0SXRlbShzdWJzY3JpcHRpb24pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaXNVc2VyU3Vic2NyaWJlZFRvRmlsZSh1c2VySWQ6IHN0cmluZywgZmlsZUlkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IHBhcmFtczogUXVlcnlDb21tYW5kSW5wdXQgPSB7XHJcbiAgICAgICAgVGFibGVOYW1lOiB0aGlzLnRhYmxlTmFtZSxcclxuICAgICAgICBLZXlDb25kaXRpb25FeHByZXNzaW9uOiBcInVzZXJJZCA9IDp1c2VySWQgQU5EIGZpbGVJZCA9IDpmaWxlSWRcIixcclxuICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XHJcbiAgICAgICAgICAgIFwiOnVzZXJJZFwiOiB7IFM6IHVzZXJJZCB9LFxyXG4gICAgICAgICAgICBcIjpmaWxlSWRcIjogeyBTOiBmaWxlSWQgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKG5ldyBRdWVyeUNvbW1hbmQocGFyYW1zKSk7XHJcbiAgICBjb25zdCBpdGVtcyA9IHJlc3BvbnNlLkl0ZW1zPy5tYXAoaSA9PiB1bm1hcnNoYWxsKGkpKTtcclxuICAgIHJldHVybiAoaXRlbXMgJiYgaXRlbXMubGVuZ3RoID4gMCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=