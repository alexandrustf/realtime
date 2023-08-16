const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDbClient = new DynamoDBClient({ });
const FILE_METADATA_TABLE = process.env.FILE_METADATA_TABLE || '';

exports.handler = async (event) => {
    try {
        const params = {
            TableName: FILE_METADATA_TABLE,
        };
        
        const data = await dynamoDbClient.send(new ScanCommand(params));
        
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        };
    } catch (error) {
        console.error("Error fetching data from FileMetadataTable:", error);
        return {
            statusCode: 500,
            body: 'Failed to fetch data'
        };
    }
};
