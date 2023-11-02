import { Construct } from "constructs";
import { Environment } from "../../Environment";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as awsCognito from "aws-cdk-lib/aws-cognito";
import * as awsSsm from "aws-cdk-lib/aws-ssm";

export class Authentication {
  readonly cognitoPool: awsCognito.UserPool;
  readonly appClient: awsCognito.UserPoolClient;

  constructor(scope: Construct, env: Environment) {
    this.cognitoPool = new awsCognito.UserPool(
      scope,
      env.createId("cognito-user-pool"),
      {
        userPoolName: env.createId("cognito-user-pool"),
        standardAttributes: {
          email: {
            mutable: true,
            required: true,
          },
        },
        passwordPolicy: {
          minLength: 8,
          tempPasswordValidity: Duration.days(7),
        },
        userVerification: {
          smsMessage: "Your verification code is {####}. ",
          emailBody:
            "Please click the link below to verify your email address. {##Verify Email##} ",
          emailSubject: "Shopping List App - Password reset",
          emailStyle: awsCognito.VerificationEmailStyle.LINK,
        },
        accountRecovery: awsCognito.AccountRecovery.EMAIL_ONLY,
        userInvitation: {
          emailBody: `
          <h1>Hello!</h1>
          <p>Welcome to Shopping lists app!</p>
          <p>A new user account has been created for you.</p>
          <p>Please visit the <a href="https://${process.env.DOMAIN_NAME}" target="_blank">Shopping List App Dashboard</a> and use the details below to finish the setup of your account and choose your own password.</p>
          <p>Your username: {username}</p>
          <p>Your temporary password: <b>{####}</b></p>
          <p>Best regards,<br> /The Redeal team<br></p>`,
          emailSubject: "Welcome to Shopping Lists App",
          smsMessage:
            "Your username is {username} and temporary password is {####}",
        },
        email: awsCognito.UserPoolEmail.withSES({
          fromEmail: process.env.FROM_EMAIL!,
          fromName: process.env.FROM_EMAIL!,
          sesRegion: env.region,
          // sesVerifiedDomain: this.config.mailingDomain,
        }),
        deletionProtection: false,
        autoVerify: {
          email: true,
        },
        signInCaseSensitive: false,
        removalPolicy: RemovalPolicy.DESTROY,
      }
    );

    this.appClient = this.cognitoPool.addClient(env.createId("client-app"), {
      userPoolClientName: env.createId("client-app"),
      refreshTokenValidity: Duration.days(30),
      accessTokenValidity: Duration.minutes(1440),
      idTokenValidity: Duration.minutes(1440),
      preventUserExistenceErrors: true,
      enableTokenRevocation: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        callbackUrls: [
          `https://${process.env.DOMAIN_NAME}/login/oauth2/code/cognito`,
          `http://localhost:5173/login/oauth2/code/cognito`,
        ],
        logoutUrls: [
          `https://${process.env.DOMAIN_NAME}/logout`,
          `http://localhost:5173/logout`,
        ],
        scopes: [awsCognito.OAuthScope.OPENID, awsCognito.OAuthScope.EMAIL],
        flows: {
          implicitCodeGrant: true,
        },
      },
    });

    this.cognitoPool.addDomain(env.createId("shop-list-app"), {
      cognitoDomain: {
        domainPrefix: env.createId("shop-list-app"),
      },
    });

    new awsSsm.StringParameter(scope, env.createId("cognito-id-param"), {
      stringValue: this.cognitoPool.userPoolId,
      dataType: awsSsm.ParameterDataType.TEXT,
      parameterName: "CognitoUserPoolID",
    });

    new awsSsm.StringParameter(
      scope,
      env.createId("cognito-appclient-id-param"),
      {
        stringValue: this.appClient.userPoolClientId,
        dataType: awsSsm.ParameterDataType.TEXT,
        parameterName: "CognitoAppClientID",
      }
    );

    new awsSsm.StringParameter(scope, env.createId("shop-list-app-param"), {
      stringValue: `${env.createId("shop-list-app")}.auth.${
        env.region
      }.amazoncognito.com`,
      dataType: awsSsm.ParameterDataType.TEXT,
      parameterName: "CognitoDomain",
    });
  }
}
