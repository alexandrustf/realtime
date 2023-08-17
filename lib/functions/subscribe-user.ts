import { UserSubscribedDynamoDB } from './services/UserSubscribedDynamoDB';

const userSubscriptionTableName = process.env.USER_SUBSCRIPTION_TABLE_NAME || '';

const userDbService = new UserSubscribedDynamoDB(userSubscriptionTableName);

exports.handler = async (event: any) => {
    const { fileId } = event.pathParameters;

    // Extract userId from the request (this could be from a JWT token, Cognito, etc.) Here's a placeholder assuming it's in the request body for simplicity
    const { userId } = JSON.parse(event.body);

    if (!fileId || !userId) {
        return {
            statusCode: 400,
            body: "Invalid request parameters, missing: fieldId or userId"
        };
    }

    try {
        await userDbService.putItem({
            userId: userId,
            fileId: fileId,
        });

        return {
            statusCode: 200,
            body: "Subscription successful"
        };
    } catch (err) {
        console.error("Error subscribing to file:", err);
        return {
            statusCode: 500,
            body: "Failed to subscribe to file"
        };
    }
};
