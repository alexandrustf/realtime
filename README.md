# Welcome to Data Synchronization - Technical Challenge

Task link: https://www.craft.me/s/Z5Rwk67MZgeXAI
Documentation: https://www.craft.me/s/NYbbNJJCL2OfAI or in docs PDF

Build and deploy a prototype service to a cloud platform that enables clients to incrementally synchronize data in the cloud. 

Requirements
The service 


1.
Enables to upload (i.e. insert, update, delete) and download batches of data records.

2.
Enables to synchronize data across multiple clients: when one client applies changes on the data records, other clients will able see those changes locally.

3.
Supports incremental synchronization meaning that clients can retrieve only the data records which were updated since the previous sync operation.

The documentation
As written communication is just as important at Craft as verbal communication, we would like to ask you to do a written overview in a Craft document:

1.
Explains the service architecture on a detailed level.

2.
Lists the known limitations.

3.
Showcases the potential next steps in order to turn the service into a production grade solution.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
