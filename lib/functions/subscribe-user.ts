import { SNSService } from './services/SNSService';
import { UserSubscribedDynamoDB } from './services/UserSubscribedDynamoDB';

const userSubscriptionTableName: string = process.env.USER_SUBSCRIPTION_TABLE_NAME || '';
const SNS_TOPIC_ARN: string = process.env.SNS_TOPIC_ARN || '';

const userDbService = new UserSubscribedDynamoDB(userSubscriptionTableName);
const snsService = new SNSService(SNS_TOPIC_ARN);

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

        // If email is provided, subscribe it to the SNS topic
        const { body } = event;
        if(body) {
            const input = JSON.parse(body);
            // Similar, other protocols could be added protocols phone, SQS, eventbridge etc.
            // This could be refactored to have an interface Subscriber which will be implemented by EmailSubscriber, SQSSubscriber etc. and will override the subscribe method
            if (input.email && input.protocol === "email") {
                await snsService.subscribeEmail(input.email, input.protocol);
            }
        }


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
