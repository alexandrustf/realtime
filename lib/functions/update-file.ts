import { FileMetadataDynamoDB } from './services/FileMetadataDynamoDB';

const fileMetadataTableName = process.env.FILE_METADATA_TABLE_NAME || '';
const dbService = new FileMetadataDynamoDB(fileMetadataTableName);

exports.handler = async (event: any) => {
    const { fileId } = event.pathParameters;
    const { userId, data } = JSON.parse(event.body);

    if (!fileId || !userId || !data) {
        return {
            statusCode: 400,
            body: "Invalid request parameters"
        };
    }

    try {
        const latestItems = await dbService.query(fileId); // might add ScanIndexForward option
        console.log(latestItems)
        const latestVersion = latestItems && latestItems.length > 0 ? Math.max(...latestItems.map(item => item.version)) : 0; 

        const newItem = {
            fileId: fileId,
            version: latestVersion + 1,
            userId: userId,
            addedData: data
        };

        await dbService.putItem(newItem);

        return {
            statusCode: 200,
            body: JSON.stringify(newItem),
        };
    } catch (err) {
        console.error("Error updating data:", err);
        return {
            statusCode: 500,
            body: "Failed to update data"
        };
    }
};
