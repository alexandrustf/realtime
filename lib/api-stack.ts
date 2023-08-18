import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import path = require('path');

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const fileMetadataTableName = Fn.importValue('FileMetadataTableName');
    const userSubscriptionTableName = Fn.importValue('UserSubscriptionTableName');
    const importedFileTopicArn = Fn.importValue('FileUpdateTopicArn');
    const importedFileMetadataTable = Table.fromTableName(this, 'ImportedFileMetadataTable', fileMetadataTableName);
    const userSubscriptionTable = Table.fromTableName(this, 'ImportedUserSubscriptionTableName', userSubscriptionTableName);

    const api = new apigw.RestApi(this, `SyncDataApiGateway`, {
        restApiName: `SyncData-api`,
        deployOptions: {
          metricsEnabled: true,
          loggingLevel: apigw.MethodLoggingLevel.INFO,
          dataTraceEnabled: true,
        },
        cloudWatchRole: true,
        defaultCorsPreflightOptions: {
            allowHeaders: [
              'Content-Type',
              'X-Amz-Date',
              'Authorization',
              'X-Api-Key',
            ],
            allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowCredentials: true,
            allowOrigins: ['http://localhost:3000'],
          },
      });
    const insertFileLambda = new lambda.Function(this, 'insert-file-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
        timeout: Duration.seconds(29),
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
            USER_SUBSCRIPTION_TABLE_NAME: userSubscriptionTableName,
        },
        handler: 'insert-file.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadWriteData(insertFileLambda);
    userSubscriptionTable.grantReadWriteData(insertFileLambda);

    const updateFileLambda = new lambda.Function(this, 'update-file-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
        timeout: Duration.seconds(29), 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'update-file.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadWriteData(updateFileLambda);

    const getAllFilesLambda = new lambda.Function(this, 'get-all-files-lambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(29), 
      environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
      },
      handler: 'get-all-files.handler',
      code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadData(getAllFilesLambda);

    const getDataLambda = new lambda.Function(this, 'get-file-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
        timeout: Duration.seconds(29), 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'get-file.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadData(getDataLambda);

    const deleteDataLambda = new lambda.Function(this, 'delete-data-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
         timeout: Duration.seconds(29), 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'delete-data.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadWriteData(deleteDataLambda);

    const subscribeUserLambda = new lambda.Function(this, 'subscribe-user-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
         timeout: Duration.seconds(29), 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
            USER_SUBSCRIPTION_TABLE_NAME: userSubscriptionTableName,
        },
        handler: 'subscribe-user.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    userSubscriptionTable.grantReadWriteData(subscribeUserLambda);
    subscribeUserLambda.addToRolePolicy(new PolicyStatement({
      actions: ['sns:Subscribe'],
      resources: [importedFileTopicArn],
  }));
    
    const filesResource = api.root.addResource('files');
    const fileIdResource = filesResource.addResource('{fileId}');
    fileIdResource.addMethod('GET', new apigw.LambdaIntegration(getDataLambda));
    const versionResource = fileIdResource.addResource('{version}');
    versionResource.addMethod('GET', new apigw.LambdaIntegration(getDataLambda));
    filesResource.addMethod(
      'GET',
      new apigw.LambdaIntegration(getAllFilesLambda, {proxy: true}),
    );

    filesResource.addMethod(
      'POST',
      new apigw.LambdaIntegration(insertFileLambda, {proxy: true}),
    );

    fileIdResource.addMethod(
      'PUT',
      new apigw.LambdaIntegration(updateFileLambda, {proxy: true}),
    );

    fileIdResource.addMethod(
      'DELETE',
      new apigw.LambdaIntegration(deleteDataLambda, {proxy: true}),
    );

    const subscribers = fileIdResource.addResource('subscribers');
    subscribers.addMethod(
      'POST',
      new apigw.LambdaIntegration(subscribeUserLambda, {proxy: true}),
    );

    new CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
