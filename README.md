# AWSome Agency

Digital Agency B2B business called AWSome Agency.
1/ DynamoDB Database with storage-first EDA - Lambda processes the stream.
2/ Events go to Domain specific SQS queues and are processed by Lambda with actions for downstream systems.
3/ There is a static website Vite + React deployed to S3 + CloudFront.
4/ The API is a HTTP API running in Lambda
NB: End-to-end type safety.

Slides talk about Database choices
And the storage-first EDA diagram
Demo shows some magic
1/ We use CDK to deploy website.
2/ There are 3 Stacks DB, Web, API
3/ We show an order writing to DB.
4/ Show the project structure.
5/ Then add the Event Stream.
6/ Add another order - show the flow of the stream ()
Explain how these act as hooks for archiving data or automating tasks.

Summary. What have we seen?
CDKv2 + Modern Full Stack TypeScript Development.
Modern Typescript libraries tRPC for type safety across backend to frontend (React + Vite).
A lightweight option when you don't need REST or GraphQL.
Infrastructure-as-Code deployment with CDK.
Testing infrastructure, domain code and API functions.
Going further what else can we do?
CDK pipelines is an option or some sort of CI/CD.
Lambda Event Filtering. Custom Domain names etc.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
