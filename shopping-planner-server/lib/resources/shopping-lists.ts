import { Construct } from "constructs";
import { Environment } from "../../Environment";
import { RemovalPolicy } from "aws-cdk-lib";
import * as awsApigateway from "aws-cdk-lib/aws-apigateway";
import * as awsLambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import * as awsDynamodb from "aws-cdk-lib/aws-dynamodb";
import * as awsCognito from "aws-cdk-lib/aws-cognito";

interface Props {
  userPool: awsCognito.UserPool;
  cognitoUserPoolClient: awsCognito.UserPoolClient;
}

export class ShoppingLists {
  constructor(scope: Construct, env: Environment, props: Props) {
    // NAMES
    const listsTableName = env.createId("lists-table");
    const listRestApiName = env.createId("lists-rest-api");

    const listsLambda = new awsLambdaNode.NodejsFunction(
      scope,
      env.createId("lists-lambda"),
      {
        entry: "src/lambdas/listsLambda/listsLambda.ts",
        environment: {
          LISTS_TABLE_NAME: listsTableName,
          USER_POOL_ID: props.userPool.userPoolId,
          COGNITO_CLIENT_ID: props.cognitoUserPoolClient.userPoolClientId,
        },
        bundling: {
          externalModules: ["@aws-sdk"],
        },
      }
    );

    const apiAuth = new awsApigateway.CognitoUserPoolsAuthorizer(
      scope,
      env.createId("api-auth"),
      {
        cognitoUserPools: [props.userPool],
      }
    );

    const listsRestApi = new awsApigateway.RestApi(scope, listRestApiName, {
      restApiName: listRestApiName,
      deployOptions: { stageName: env.envName },
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type", "Authorization"],
        allowOrigins: [`https://${process.env.DOMAIN_NAME}`],
        allowMethods: awsApigateway.Cors.ALL_METHODS,
      },
    });

    const listsRestApiLists = listsRestApi.root.addResource("lists");
    listsRestApiLists.addMethod(
      "GET",
      new awsApigateway.LambdaIntegration(listsLambda),
      {
        authorizer: apiAuth,
        authorizationType: awsApigateway.AuthorizationType.COGNITO,
      }
    );

    const listsRestApiListRoot = listsRestApi.root.addResource("list");
    const listsRestApiSingleList = listsRestApiListRoot.addResource("{listId}");
    listsRestApiSingleList.addMethod(
      "GET",
      new awsApigateway.LambdaIntegration(listsLambda),
      {
        authorizer: apiAuth,
        authorizationType: awsApigateway.AuthorizationType.COGNITO,
      }
    );
    listsRestApiSingleList.addMethod(
      "POST",
      new awsApigateway.LambdaIntegration(listsLambda),
      {
        authorizer: apiAuth,
        authorizationType: awsApigateway.AuthorizationType.COGNITO,
      }
    );
    listsRestApiSingleList.addMethod(
      "DELETE",
      new awsApigateway.LambdaIntegration(listsLambda),
      {
        authorizer: apiAuth,
        authorizationType: awsApigateway.AuthorizationType.COGNITO,
      }
    );

    const listsRestApiNewList = listsRestApiListRoot.addResource("new");
    listsRestApiNewList.addMethod(
      "POST",
      new awsApigateway.LambdaIntegration(listsLambda),
      {
        authorizer: apiAuth,
        authorizationType: awsApigateway.AuthorizationType.COGNITO,
      }
    );

    const listsTable = new awsDynamodb.Table(scope, listsTableName, {
      tableName: listsTableName,
      partitionKey: {
        name: "listId",
        type: awsDynamodb.AttributeType.STRING,
      },
      billingMode: awsDynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    listsTable.grantReadData(listsLambda);
    listsTable.grantWriteData(listsLambda);

    listsTable.addGlobalSecondaryIndex({
      indexName: "usernameKey",
      partitionKey: {
        name: "username",
        type: awsDynamodb.AttributeType.STRING,
      },
      readCapacity: 1,
      writeCapacity: 1,
    });
  }
}
