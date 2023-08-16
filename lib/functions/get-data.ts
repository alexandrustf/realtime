import { DynamoDBService } from "./services/dynamoDBService";

const fileMetadataTableName = process.env.FILE_METADATA_TABLE_NAME || '';
const dbService = new DynamoDBService(fileMetadataTableName);

exports.handler = async (event: any) => {
    const { fileId } = event.pathParameters;
    const version = event.pathParameters.version ? parseInt(event.pathParameters.version) : null;

    if (version && isNaN(version)) {
        return {
            statusCode: 400,
            body: "Invalid version provided"
        };
    }

    try {
        if (version) {
            const items = await dbService.getItemsWithVersionGreaterThan(fileId, version);
            if (!items || items.length === 0) {
                return {
                    statusCode: 404,
                    body: "No newer versions found"
                };
            }
            return {
                statusCode: 200,
                body: JSON.stringify(items)
            };
        } else {
            const items = await dbService.query("fileId = :fileId", { ":fileId": { S: fileId } });
            return {
                statusCode: 200,
                body: JSON.stringify(items)
            };
        }
    } catch (err) {
        console.error("Error fetching file:", err);
        return {
            statusCode: 500,
            body: "Failed to fetch file"
        };
    }
};
