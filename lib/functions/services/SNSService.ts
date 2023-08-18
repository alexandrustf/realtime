import { SNSClient, PublishCommand, SubscribeCommand } from "@aws-sdk/client-sns";

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

    async subscribeEmail(email: string, protocol: string = "email"): Promise<void> {
        const params = {
            Protocol: protocol,
            Endpoint: email,
            TopicArn: this.topicArn
        };

        try {
            await this.sns.send(new SubscribeCommand(params));
            console.log(`Email ${email} subscribed successfully.`);
        } catch (error) {
            console.error('Error subscribing email to SNS:', error);
            throw error;
        }
    }
}
