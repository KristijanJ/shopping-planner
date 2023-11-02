#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ShoppingPlannerStack } from "../lib/shopping-planner-stack";
import { Environment } from "../Environment";
import { Region } from "../services/definitions/Region";

const app = new cdk.App();

const ENV_NAME = Environment.getRequiredEnvironmentVariable("ENV_NAME");
const CDK_DEFAULT_REGION =
  Environment.getRequiredEnvironmentVariable("CDK_DEFAULT_REGION");
const CDK_DEFAULT_ACCOUNT = Environment.getRequiredEnvironmentVariable(
  "CDK_DEFAULT_ACCOUNT"
);
Environment.getRequiredEnvironmentVariable("CERTIFICATE_ID");
Environment.getRequiredEnvironmentVariable("DOMAIN_NAME");
Environment.getRequiredEnvironmentVariable("FROM_EMAIL");

const env = new Environment(
  ENV_NAME,
  CDK_DEFAULT_REGION as Region,
  CDK_DEFAULT_ACCOUNT
);

new ShoppingPlannerStack(app, env.createId("shopping-planner-stack"), {
  env,
});
