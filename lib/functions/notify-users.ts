import { UserSubscribedDynamoDB } from "./services/UserSubscribedDynamoDB";
import { SNSService } from './services/SNSService';

const USER_SUBSCRIPTION_TABLE_NAME = process.env.USER_SUBSCRIPTION_TABLE_NAME || '';
const USER_ID_SUBSCRIPTION_INDEX_NAME: string = process.env.USER_ID_SUBSCRIPTION_INDEX_NAME || 'UserIdSubscriptionIndex';
const SNS_TOPIC_ARN: string = process.env.SNS_TOPIC_ARN || '';

const dbService = new UserSubscribedDynamoDB(USER_SUBSCRIPTION_TABLE_NAME);
const snsService = new SNSService(SNS_TOPIC_ARN);

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    try {
        for (const record of event.Records) {
                const fileId = record.dynamodb.NewImage.fileId.S;
                const version = record.dynamodb.NewImage.version.N;

                const users: any = await dbService.queryIndex(fileId, USER_ID_SUBSCRIPTION_INDEX_NAME);
                if(users)
                    await notifyUsers(users, fileId, version);
                else console.log("No users to notify");
        }
    } catch (error) {
        console.error('Error processing DynamoDB stream event:', error);
        throw error;
    }
};

async function notifyUsers(users, fileId, version) {
    console.log({users});
    for (const user of users) {  // this could be improved with Promise.all
        console.log(`Notify user ${user.userId} about new file version for ${fileId} and version: ${version}`);
        
        const message = {
           fileId: fileId,
            greeting: `Hello ${user.userId}, there's a new update for for ${fileId} and version: ${version}. Check it out!`
        };

        try {
            await snsService.publishMessage(`Update for file ${fileId} version ${version}`, JSON.stringify(message)); 
            console.log(`Notification sent to ${user.userId} successfully.`);
        } catch (error) {
            console.error(`Failed to send notification to ${user.userId}. Error:`, error);
        }
    }
}
