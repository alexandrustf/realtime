import { DynamoDBService } from "./services/dynamoDBService";

const _ = require('lodash');
const fileMetadataTableName = process.env.FILE_METADATA_TABLE_NAME || '';
const dbService = new DynamoDBService(fileMetadataTableName);

exports.handler = async () => {
    try {
        const result: any = await dbService.scan();
        // const result: any = await dbService.query('fileId = :fileId', {
        //     ':fileId': fileId
        //     }, USER_ID_SUBSCRIPTION_INDEX_NAME);
        const items = result?.Items; // this should scan the entire dataset. might be added a GSI
        const uniqueFileIds = _.uniq(items.map(item => item.fileId.S));

        return {
            statusCode: 200,
            body: JSON.stringify(uniqueFileIds)
        };
    } catch (err) {
        console.error("Error fetching files:", err);
        return {
            statusCode: 500,
            body: "Failed to fetch files"
        };
    }
};

