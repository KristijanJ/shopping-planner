import { Construct } from "constructs";
import { Environment } from "../../Environment";
import * as awsS3 from "aws-cdk-lib/aws-s3";
import * as awsS3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as awsCloudfront from "aws-cdk-lib/aws-cloudfront";
import * as awsCloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as awsCertificateManager from "aws-cdk-lib/aws-certificatemanager";

export class ClientHosting {
  constructor(scope: Construct, env: Environment) {
    const clientBucket = new awsS3.Bucket(
      scope,
      env.createId("client-bucket"),
      {
        bucketName: env.createId("client-bucket"),
        websiteIndexDocument: "index.html",
        websiteErrorDocument: "index.html",
        publicReadAccess: true,
        blockPublicAccess: {
          blockPublicAcls: false,
          blockPublicPolicy: false,
          ignorePublicAcls: false,
          restrictPublicBuckets: false,
        },
      }
    );

    new awsS3Deployment.BucketDeployment(
      scope,
      env.createId("client-bucket-deploy"),
      {
        sources: [awsS3Deployment.Source.asset("./client-build")],
        destinationBucket: clientBucket,
        memoryLimit: 1024,
      }
    );

    new awsCloudfront.Distribution(scope, env.createId("client-distribution"), {
      domainNames: [process.env.DOMAIN_NAME!],
      defaultBehavior: {
        origin: new awsCloudfrontOrigins.S3Origin(clientBucket),
        allowedMethods: awsCloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy:
          awsCloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      },
      certificate: awsCertificateManager.Certificate.fromCertificateArn(
        scope,
        env.createId("client-cert"),
        `arn:aws:acm:us-east-1:${env.account}:certificate/${process.env.CERTIFICATE_ID}`
      ),
    });
  }
}
