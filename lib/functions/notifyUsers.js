const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USER_SUBSCRIPTION_TABLE = process.env.USER_SUBSCRIPTION_TABLE || '';

exports.handler = async (event) => {
    try {
        for (const record of event.Records) {
            if (record.eventName === 'INSERT') { // Only process new files
                const fileId = record.dynamodb.NewImage.fileId.S;

                // Query the GSI to find users subscribed to this file
                const params = {
                    TableName: USER_SUBSCRIPTION_TABLE,
                    IndexName: 'UserIdSubscriptionIndex',
                    KeyConditionExpression: 'fileId = :fileId',
                    ExpressionAttributeValues: {
                        ':fileId': fileId
                    }
                };

                const result = await dynamoDb.query(params).promise();

                // Notify the users (For simplicity, we'll just log them here. In a real-world scenario, you might send emails or push notifications.)
                await notifyUsers(result.Items);
            }
        }
    } catch (error) {
        console.error('Error processing DynamoDB stream event:', error);
        throw error;
    }
};

async function notifyUsers(users) {
    console.log({users});
    for (const user of users) {
        console.log(`Notify user ${user.userId} about new file ${fileId}`);
    }
}
