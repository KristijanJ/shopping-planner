import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ShoppingLists } from "./resources/shopping-lists";
import { Environment } from "../Environment";
import { ClientHosting } from "./resources/client-hosting";
import { Authentication } from "./resources/authentication";

interface Props extends cdk.StackProps {
  env: Environment;
}

export class ShoppingPlannerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const auth = new Authentication(this, props.env);

    new ShoppingLists(this, props.env, {
      userPool: auth.cognitoPool,
      cognitoUserPoolClient: auth.appClient,
    });

    new ClientHosting(this, props.env);
  }
}
