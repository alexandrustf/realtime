import { uniq } from "lodash";
import { FileMetadataDynamoDB } from "./services/FileMetadataDynamoDB";

const fileMetadataTableName = process.env.FILE_METADATA_TABLE_NAME || '';
const dbService = new FileMetadataDynamoDB(fileMetadataTableName);

exports.handler = async () => {
    try {
        const items: any = await dbService.scan();
        const uniqueFileIds = uniq(items.map(item => item.fileId));

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

