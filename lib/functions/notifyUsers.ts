import { DynamoDBService } from "./services/dynamoDBService";

const USER_SUBSCRIPTION_TABLE_NAME = process.env.USER_SUBSCRIPTION_TABLE_NAME || '';
const USER_ID_SUBSCRIPTION_INDEX_NAME: string = process.env.USER_ID_SUBSCRIPTION_INDEX_NAME || 'UserIdSubscriptionIndex';
const dbService = new DynamoDBService(USER_SUBSCRIPTION_TABLE_NAME);

exports.handler = async (event) => {
    try {
        for (const record of event.Records) {
            if (record.eventName === 'INSERT') { // Only process new files
                const fileId = record.dynamodb.NewImage.fileId.S;

                const result: any = await dbService.query('fileId = :fileId', {
                    ':fileId': fileId
                    }, USER_ID_SUBSCRIPTION_INDEX_NAME);
                if(result.Items)
                    await notifyUsers(result.Items, fileId);
            }
        }
    } catch (error) {
        console.error('Error processing DynamoDB stream event:', error);
        throw error;
    }
};

async function notifyUsers(users, fileId) {
    console.log({users});
    for (const user of users) {
        console.log(`Notify user ${user.userId} about new file ${fileId}`);
    }
}
