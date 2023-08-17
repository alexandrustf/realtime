import { FileMetadataDynamoDB } from "./services/FileMetadataDynamoDB";

const fileMetadataTableName = process.env.FILE_METADATA_TABLE_NAME || '';
const dbService = new FileMetadataDynamoDB(fileMetadataTableName);

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
        let items;
        if (version) {
            items = await dbService.getItemsWithVersionGreaterThan(fileId, version);
            if (!items || items.length === 0) {
                return {
                    statusCode: 404,
                    body: "No newer versions found"
                };
            }
        } else {
            items = await dbService.query("fileId = :fileId", { ":fileId": { S: fileId } });
        }

        const concatenatedData = items.reduce((acc, item) => acc + item.data, "");

        const responseItem = {
            fileId: fileId,
            data: concatenatedData
        };

        return {
            statusCode: 200,
            body: JSON.stringify(responseItem)
        };
    } catch (err) {
        console.error("Error fetching file:", err);
        return {
            statusCode: 500,
            body: "Failed to fetch file"
        };
    }
};
