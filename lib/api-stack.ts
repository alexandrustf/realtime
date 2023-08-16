import * as apigw from 'aws-cdk-lib/aws-apigateway';
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
    const insertDataLambda = new lambda.Function(this, 'insert-data-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'insert-data.handler',
        code: Code.fromAsset(path.join(__dirname, 'functions')),
    });
    const updateDataLambda = new lambda.Function(this, 'update-data-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'update-data.handler',
        code: Code.fromAsset(path.join(__dirname, 'functions')),
    });
    const getDataLambda = new lambda.Function(this, 'get-data-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'get-data.handler',
        code: Code.fromAsset(path.join(__dirname, 'functions')),
    });
    const deleteDataLambda = new lambda.Function(this, 'delete-data-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
        },
        handler: 'delete-data.handler',
        code: Code.fromAsset(path.join(__dirname, 'functions')),
    });
    const subscribeUserLambda = new lambda.Function(this, 'subscribe-user-lambda', {
        runtime: lambda.Runtime.NODEJS_16_X, 
        environment: {
            FILE_METADATA_TABLE_NAME: fileMetadataTableName,
            USER_SUBSCRIPTION_TABLE_NAME: userSubscriptionTableName,
        },
        handler: 'subscribe-users.handler',
        code: Code.fromAsset(path.join(__dirname, 'functions')),
    });

    const data = api.root.addResource('data');

    data.addMethod(
      'GET',
      new apigw.LambdaIntegration(getDataLambda, {proxy: true}),
    );

    data.addMethod(
      'POST',
      new apigw.LambdaIntegration(insertDataLambda, {proxy: true}),
    );

    data.addMethod(
      'PUT',
      new apigw.LambdaIntegration(updateDataLambda, {proxy: true}),
    );

    data.addMethod(
      'DELETE',
      new apigw.LambdaIntegration(deleteDataLambda, {proxy: true}),
    );

    const subscribers = api.root.addResource('subscribers');
    subscribers.addMethod(
      'POST',
      new apigw.LambdaIntegration(subscribeUserLambda, {proxy: true}),
    );

    // new CfnOutput(this, 'ApiUrl', {
    //   value: api.uri,
    // });
  }
}
