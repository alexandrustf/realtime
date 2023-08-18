import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib/core';
import { Table, AttributeType, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import path = require('path');
import { Construct } from 'constructs';
import { Code, Runtime, Function, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Topic } from 'aws-cdk-lib/aws-sns';

export class DatabaseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fileMetadataTable = new Table(this, 'FileMetadataTable', {
      partitionKey: { name: 'fileId', type: AttributeType.STRING },
      sortKey: { name: 'version', type: AttributeType.NUMBER },
      tableName: 'FileMetadata',
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const userSubscriptionTable = new Table(this, 'UserSubscriptionTable', {
      partitionKey: { name: 'userId', type: AttributeType.STRING },
      sortKey: { name: 'fileId', type: AttributeType.STRING },
      tableName: 'UserSubscription',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const gsi = userSubscriptionTable.addGlobalSecondaryIndex({
      indexName: 'UserIdSubscriptionIndex',
      partitionKey: { name: 'fileId', type: AttributeType.STRING },
      sortKey: { name: 'userId', type: AttributeType.STRING },
    });

    const fileUpdateTopic = new Topic(this, 'FileUpdateTopic', {
      displayName: 'File Update Notifications',
      topicName: 'FileUpdateNotifications'
  });
    const notifyUsersLambda = new Function(this, 'notifyUsersLambda', {
      runtime: Runtime.NODEJS_16_X, 
      environment: {
          FILE_METADATA_TABLE_NAME: fileMetadataTable.tableName,
          USER_SUBSCRIPTION_TABLE_NAME: userSubscriptionTable.tableName,
          SNS_TOPIC_ARN: fileUpdateTopic.topicArn,
      },
      code: Code.fromAsset(path.join(__dirname, 'functions')),
      handler: "notify-users.handler",
    });
    notifyUsersLambda.addEventSource(new DynamoEventSource(fileMetadataTable, {
      startingPosition: StartingPosition.TRIM_HORIZON
    }));
    fileUpdateTopic.grantPublish(notifyUsersLambda);


    userSubscriptionTable.grantReadWriteData(notifyUsersLambda);

    new CfnOutput(this, 'FileUpdateTopicArn', {
      value: fileUpdateTopic.topicArn,
      exportName: 'FileUpdateTopicArn',
    });

    new CfnOutput(this, 'FileMetadataTableName', {
      value: fileMetadataTable.tableName,
      exportName: 'FileMetadataTableName',
    });
    new CfnOutput(this, 'FileMetadataTableArn', {
      value: fileMetadataTable.tableArn,
      exportName: 'FileMetadataTableArn',
    });

    new CfnOutput(this, 'UserSubscriptionTableName', {
      value: userSubscriptionTable.tableName,
      exportName: 'UserSubscriptionTableName',
    });
    new CfnOutput(this, 'UserSubscriptionTableArn', {
      value: userSubscriptionTable.tableArn,
      exportName: 'UserSubscriptionTableArn',
    });
  
  }
}
