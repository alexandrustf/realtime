import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export class SNSService {
    private sns: SNSClient;
    private topicArn: string;

    constructor(topicArn: string) {
        this.sns = new SNSClient({});
        this.topicArn = topicArn;
    }

    async publishMessage(subject: string, message: string): Promise<void> {
        const params = {
            Subject: subject,
            Message: message,
            TopicArn: this.topicArn
        };

        try {
            await this.sns.send(new PublishCommand(params));
            console.log(`Message with subject "${subject}" published successfully.`);
        } catch (error) {
            console.error('Error publishing message to SNS:', error);
            throw error;
        }
    }
}
