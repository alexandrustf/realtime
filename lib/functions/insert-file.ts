import { FileMetadataDynamoDB } from './services/FileMetadataDynamoDB';
import { UserSubscribedDynamoDB } from './services/UserSubscribedDynamoDB';
import { Record, String } from 'runtypes';

const fileMetadataTableName = process.env.FILE_METADATA_TABLE_NAME || '';
const userSubscriptionTableName = process.env.USER_SUBSCRIPTION_TABLE_NAME || '';

const fileDbService = new FileMetadataDynamoDB(fileMetadataTableName);
const userDbService = new UserSubscribedDynamoDB(userSubscriptionTableName);

const ItemRuntype = Record({
    fileId: String,
    userId: String,
    data: String,
});

exports.handler = async (event: any) => {
    const { body } = event;
    const item = JSON.parse(body);

    if (!ItemRuntype.guard(item)) {
        return {
            statusCode: 400,
            body: "Invalid data format. The required fields are: fileId(String), userId(String), data(String)"
        };
    }

    try {
        const insertItem = {
            fileId: item.fileId,
            version: 1,
            userId: item.userId, // Extract userId from the request (this could be from a JWT token, Cognito, etc.)  Here's a placeholder assuming it's in the request body for simplicity
            data: item.data
        };
        await fileDbService.putItem(insertItem);

        await userDbService.putItem({
            userId: item.userId,
            fileId: item.fileId
        });

        return {
            statusCode: 200,
            body: JSON.stringify(insertItem),
        };
    } catch (err) {
        console.error("Error inserting data:", err);
        return {
            statusCode: 500,
            body: "Failed to insert data"
        };
    }
};
