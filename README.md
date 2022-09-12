# AWSome Agency

Digital Agency B2B business called AWSome Agency.
1/ DynamoDB Database with storage-first EDA - Lambda processes the stream.  
2/ Events go to Domain specific SQS queues and are processed by Lambda with actions for downstream systems.  
3/ There is a static website Vite + React deployed to S3 + CloudFront.  
4/ The API is a HTTP API running in Lambda  
NB: End-to-end type safety.

Slides talk about Database choices and the storage-first EDA diagram  
Demo shows:  
1/ There are 3 Stacks deployed => DB, Web, API  
2/ We show an order writing to DB.  
3/ Show the project structure.  
4/ Then add the Event Stream.  
5/ Add another order - show the flow of the stream ()  
Explain how these act as hooks for archiving data or automating tasks.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

```
aws dynamodb put-item \
    --table-name Table \
    --item '{
        "pk": {"S": "EVENT#NEWAPP"}
        "sk": {"S": "2022-01-01"}
      }'
```
