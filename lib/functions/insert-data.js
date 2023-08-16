const { String, Record } = require("runtypes");

const fileMetadataTableName = process.env.FILE_METADATA_TABLE_NAME || '';
const dbService = new DynamoDBService(fileMetadataTableName);

const ItemRuntype = Record({
    fileId: String,
    version: String,
    user: String,
    data: Any,
});

exports.handler = async (event) => {
    const { body } = event;
    const item = JSON.parse(body);

    if (!ItemRuntype.guard(item)) {
        return {
            statusCode: 400,
            body: "Invalid data format"
        };
    }

    try {
        const result = await dbService.putItem(item);
        return {
            statusCode: 200,
            body: "Data inserted successfully"
        };
    } catch (err) {
        console.error("Error inserting data:", err);
        return {
            statusCode: 500,
            body: "Failed to insert data"
        };
    }
};
