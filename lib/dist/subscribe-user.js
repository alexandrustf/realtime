"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserSubscribedDynamoDB_1 = require("./services/UserSubscribedDynamoDB");
const userSubscriptionTableName = process.env.USER_SUBSCRIPTION_TABLE_NAME || '';
const userDbService = new UserSubscribedDynamoDB_1.UserSubscribedDynamoDB(userSubscriptionTableName);
exports.handler = async (event) => {
    const { fileId } = event.pathParameters;
    // Extract userId from the request (this could be from a JWT token, Cognito, etc.) Here's a placeholder assuming it's in the request body for simplicity
    const { userId } = JSON.parse(event.body);
    if (!fileId || !userId) {
        return {
            statusCode: 400,
            body: "Invalid request parameters"
        };
    }
    try {
        await userDbService.putItem({
            userId: userId,
            fileId: fileId
        });
        return {
            statusCode: 200,
            body: "Subscription successful"
        };
    }
    catch (err) {
        console.error("Error subscribing to file:", err);
        return {
            statusCode: 500,
            body: "Failed to subscribe to file"
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlLXVzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9mdW5jdGlvbnMvc3Vic2NyaWJlLXVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4RUFBMkU7QUFFM0UsTUFBTSx5QkFBeUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQztBQUVqRixNQUFNLGFBQWEsR0FBRyxJQUFJLCtDQUFzQixDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFFNUUsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLEVBQUU7SUFDbkMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7SUFFeEMsd0pBQXdKO0lBQ3hKLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUxQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ3BCLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSw0QkFBNEI7U0FDckMsQ0FBQztLQUNMO0lBRUQsSUFBSTtRQUNBLE1BQU0sYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUN4QixNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FBQztRQUVILE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSx5QkFBeUI7U0FDbEMsQ0FBQztLQUNMO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSw2QkFBNkI7U0FDdEMsQ0FBQztLQUNMO0FBQ0wsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXNlclN1YnNjcmliZWREeW5hbW9EQiB9IGZyb20gJy4vc2VydmljZXMvVXNlclN1YnNjcmliZWREeW5hbW9EQic7XHJcblxyXG5jb25zdCB1c2VyU3Vic2NyaXB0aW9uVGFibGVOYW1lID0gcHJvY2Vzcy5lbnYuVVNFUl9TVUJTQ1JJUFRJT05fVEFCTEVfTkFNRSB8fCAnJztcclxuXHJcbmNvbnN0IHVzZXJEYlNlcnZpY2UgPSBuZXcgVXNlclN1YnNjcmliZWREeW5hbW9EQih1c2VyU3Vic2NyaXB0aW9uVGFibGVOYW1lKTtcclxuXHJcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55KSA9PiB7XHJcbiAgICBjb25zdCB7IGZpbGVJZCB9ID0gZXZlbnQucGF0aFBhcmFtZXRlcnM7XHJcblxyXG4gICAgLy8gRXh0cmFjdCB1c2VySWQgZnJvbSB0aGUgcmVxdWVzdCAodGhpcyBjb3VsZCBiZSBmcm9tIGEgSldUIHRva2VuLCBDb2duaXRvLCBldGMuKSBIZXJlJ3MgYSBwbGFjZWhvbGRlciBhc3N1bWluZyBpdCdzIGluIHRoZSByZXF1ZXN0IGJvZHkgZm9yIHNpbXBsaWNpdHlcclxuICAgIGNvbnN0IHsgdXNlcklkIH0gPSBKU09OLnBhcnNlKGV2ZW50LmJvZHkpO1xyXG5cclxuICAgIGlmICghZmlsZUlkIHx8ICF1c2VySWQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXHJcbiAgICAgICAgICAgIGJvZHk6IFwiSW52YWxpZCByZXF1ZXN0IHBhcmFtZXRlcnNcIlxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB1c2VyRGJTZXJ2aWNlLnB1dEl0ZW0oe1xyXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcclxuICAgICAgICAgICAgZmlsZUlkOiBmaWxlSWRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxyXG4gICAgICAgICAgICBib2R5OiBcIlN1YnNjcmlwdGlvbiBzdWNjZXNzZnVsXCJcclxuICAgICAgICB9O1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHN1YnNjcmliaW5nIHRvIGZpbGU6XCIsIGVycik7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxyXG4gICAgICAgICAgICBib2R5OiBcIkZhaWxlZCB0byBzdWJzY3JpYmUgdG8gZmlsZVwiXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxuIl19