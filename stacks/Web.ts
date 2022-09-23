import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import { CfnOutput, RemovalPolicy, Stack, DockerImage } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { join } from "path";
import { execSync, ExecSyncOptions } from "child_process";
import { copySync } from "fs-extra";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export interface StaticSiteProps {
  apiUrl: string;
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution.
 */
export class StaticSite extends Construct {
  constructor(parent: Stack, name: string, props: StaticSiteProps) {
    super(parent, name);

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI",
      {
        comment: `OAI for ${name}`,
      }
    );

    // Content bucket
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: `dev-${name.toLowerCase()}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

      removalPolicy: RemovalPolicy.DESTROY,

      autoDeleteObjects: true,
    });

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );
    new CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    const distribution = new cloudfront.Distribution(this, "myDist", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(siteBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    new CfnOutput(this, "DomainName", {
      value: distribution.domainName,
    });

    const execOptions: ExecSyncOptions = {
      stdio: ["ignore", process.stderr, "inherit"],
    };

    // TODO: check why sometimes bundle does not build on synth
    const bundle = Source.asset(join(__dirname, "../web"), {
      bundling: {
        command: [
          "sh",
          "-c",
          'echo "Docker build not supported. Please install esbuild."',
        ],
        image: DockerImage.fromRegistry("alpine"),
        local: {
          tryBundle(outputDir: string) {
            try {
              execSync("esbuild --version", execOptions);
            } catch {
              return false;
            }
            execSync(`cd web && npm run build`, execOptions);
            copySync(join(__dirname, "../web/dist"), outputDir, {
              ...execOptions,
              recursive: true,
            });
            return true;
          },
        },
      },
    });

    // Deploy site contents to S3 bucket. Cache invalidation can take a long time.
    new BucketDeployment(this, "DeployWithInvalidation", {
      sources: [bundle], //[Source.asset("./web/dist")]
      destinationBucket: siteBucket,
      distribution,
      prune: false,
      distributionPaths: ["/*"],
    });

    // Generate a config.json file and place in S3 so the web app can grab the API URL.
    new AwsCustomResource(this, "ApiUrlResource", {
      logRetention: RetentionDays.ONE_DAY,
      onUpdate: {
        action: "putObject",
        parameters: {
          Body: Stack.of(this).toJsonString({
            apiUrl: props.apiUrl,
          }),
          Bucket: siteBucket.bucketName,
          CacheControl: "max-age=0, no-cache, no-store, must-revalidate",
          ContentType: "application/json",
          Key: "config.json",
        },
        physicalResourceId: PhysicalResourceId.of("config"),
        service: "S3",
      },
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          actions: ["s3:PutObject"],
          resources: [siteBucket.arnForObjects("config.json")],
        }),
      ]),
    });
  }
}
