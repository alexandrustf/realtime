"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMetadataDynamoDB = void 0;
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const BaseDynamoDB_1 = require("./BaseDynamoDB");
class FileMetadataDynamoDB extends BaseDynamoDB_1.BaseDynamoDB {
    constructor(tableName) {
        super(tableName);
    }
    async getItemsWithVersionGreaterThan(fileId, version) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: "fileId = :fileId AND version > :version",
            ExpressionAttributeValues: {
                ":fileId": { S: fileId },
                ":version": { N: version.toString() }
            }
        };
        const response = await this.client.send(new client_dynamodb_1.QueryCommand(params));
        return response.Items?.map(i => (0, util_dynamodb_1.unmarshall)(i));
    }
}
exports.FileMetadataDynamoDB = FileMetadataDynamoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZU1ldGFkYXRhRHluYW1vREIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9mdW5jdGlvbnMvc2VydmljZXMvRmlsZU1ldGFkYXRhRHluYW1vREIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMERBQW9EO0FBQ3BELDhEQUEyRTtBQUMzRSxpREFBOEM7QUFFOUMsTUFBYSxvQkFBcUIsU0FBUSwyQkFBWTtJQUVwRCxZQUFZLFNBQWlCO1FBQzNCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRUQsS0FBSyxDQUFDLDhCQUE4QixDQUFDLE1BQWMsRUFBRSxPQUFlO1FBQ2xFLE1BQU0sTUFBTSxHQUFzQjtZQUM5QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsc0JBQXNCLEVBQUUseUNBQXlDO1lBQ2pFLHlCQUF5QixFQUFFO2dCQUN2QixTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFO2dCQUN4QixVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFO2FBQ3hDO1NBQ0osQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSw4QkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbEUsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEsMEJBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FHRjtBQXJCRCxvREFxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1bm1hcnNoYWxsIH0gZnJvbSBcIkBhd3Mtc2RrL3V0aWwtZHluYW1vZGJcIjtcclxuaW1wb3J0IHsgUXVlcnlDb21tYW5kLCBRdWVyeUNvbW1hbmRJbnB1dCB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIjtcclxuaW1wb3J0IHsgQmFzZUR5bmFtb0RCIH0gZnJvbSBcIi4vQmFzZUR5bmFtb0RCXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmlsZU1ldGFkYXRhRHluYW1vREIgZXh0ZW5kcyBCYXNlRHluYW1vREIge1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yKHRhYmxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcih0YWJsZU5hbWUpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0SXRlbXNXaXRoVmVyc2lvbkdyZWF0ZXJUaGFuKGZpbGVJZDogc3RyaW5nLCB2ZXJzaW9uOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IHBhcmFtczogUXVlcnlDb21tYW5kSW5wdXQgPSB7XHJcbiAgICAgICAgVGFibGVOYW1lOiB0aGlzLnRhYmxlTmFtZSxcclxuICAgICAgICBLZXlDb25kaXRpb25FeHByZXNzaW9uOiBcImZpbGVJZCA9IDpmaWxlSWQgQU5EIHZlcnNpb24gPiA6dmVyc2lvblwiLFxyXG4gICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcclxuICAgICAgICAgICAgXCI6ZmlsZUlkXCI6IHsgUzogZmlsZUlkIH0sXHJcbiAgICAgICAgICAgIFwiOnZlcnNpb25cIjogeyBOOiB2ZXJzaW9uLnRvU3RyaW5nKCkgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKG5ldyBRdWVyeUNvbW1hbmQocGFyYW1zKSk7XHJcbiAgICByZXR1cm4gcmVzcG9uc2UuSXRlbXM/Lm1hcChpID0+IHVubWFyc2hhbGwoaSkpO1xyXG4gIH1cclxuXHJcblxyXG59XHJcbiJdfQ==