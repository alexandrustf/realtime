import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { CfnOutput, Fn, Stack, StackProps } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import path = require('path');

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const fileMetadataTableName = Fn.importValue('FileMetadataTableName');
    const userSubscriptionTableName = Fn.importValue('UserSubscriptionTableName');
    const importedFileMetadataTable = Table.fromTableName(this, 'ImportedFileMetadataTable', fileMetadataTableName);

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
    const insertDataLambda = new lambda.Function(this, 'insert-file-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'insert-file.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadWriteData(insertDataLambda);

    const updateFileLambda = new lambda.Function(this, 'update-file-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'update-file.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadWriteData(updateFileLambda);

    const getAllFilesLambda = new lambda.Function(this, 'get-all-files-lambda', {
      runtime: lambda.Runtime.NODEJS_16_X, 
      environment: {
          FILE_METADATA_TABLE_NAME: fileMetadataTableName,
      },
      handler: 'get-all-files.handler',
      code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadData(getAllFilesLambda);

    const getDataLambda = new lambda.Function(this, 'get-file-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'get-file.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadData(getDataLambda);

    // Please write the lambda function for delete-data.ts as well. /files/{fileId} but only if the file was created 
    const deleteDataLambda = new lambda.Function(this, 'delete-data-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'delete-data.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });
    importedFileMetadataTable.grantReadWriteData(deleteDataLambda);

    const subscribeUserLambda = new lambda.Function(this, 'subscribe-user-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
            USER_SUBSCRIPTION_TABLE_NAME: userSubscriptionTableName,
        },
        handler: 'subscribe-users.handler',
        code: Code.fromAsset(path.join(__dirname, 'dist')),
    });

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
      new apigw.LambdaIntegration(insertDataLambda, {proxy: true}),
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

    // new CfnOutput(this, 'ApiUrl', {
    //   value: api.uri,
    // });
  }
}
