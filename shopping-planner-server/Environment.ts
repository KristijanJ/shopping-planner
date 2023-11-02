import { Region } from "./services/definitions/Region";

type CreateIdType = "construct" | "iamStatement" | "apiGatewayModel" | "";

/**
 * A helper class used to check for required environment variables,
 * create ids for resources and add default tags to all resources
 * @param {string} name
 * @param {Region} region
 * @param {string} account
 */
export class Environment {
  readonly region: Region;
  readonly account: string;
  readonly envName: string;
  readonly appPrefix: string = "shoplist";

  constructor(envName: string, region: Region, account: string) {
    if (!envName || envName?.trim() === "") {
      throw "Environment name must be set!";
    }

    this.region = region;
    this.account = account;
    this.envName = envName;
  }

  createId(id: string, type: CreateIdType = ""): string {
    if (!id || !id?.trim()) {
      throw "Resource id cannot be an empty string";
    }

    if (type === "construct") {
      this.isIdValid(id);

      return id.toLowerCase();
    }

    this.isIdValid(id);

    const separator = "-";
    let generatedId = `${this.appPrefix}${separator}${this.envName}${separator}${id}`;

    if (["iamStatement", "apiGatewayModel"].includes(type)) {
      generatedId = generatedId.replace(/-/gi, "");
    }

    this.isIdValid(generatedId, true);

    return generatedId.toLowerCase();
  }

  isIdValid(id: string, isGenerated = false) {
    const regex = /^(?!-)(?!.*--)[A-Za-z0-9-]+(?<!-)$/i;

    if (!regex.test(id)) {
      throw `Resource id: "${id}" must contain only alphanumeric characters and hyphens(-). It must not start/end with a hyphen(-). It must not have a double hyphen (--).`;
    }

    const min = 3;
    const max = isGenerated ? 63 : 33;
    if (id.length < min || id.length > max) {
      throw `Resource id: "${id}" must be between ${min} and ${max} characters long`;
    }
  }

  generateDefaultTags() {
    return {
      environment: this.envName,
      application: this.appPrefix,
    };
  }

  static getRequiredEnvironmentVariable(envName: string): string {
    const requiredEnvVar =
      process.env[envName] || process.env["npm_config_" + envName] || undefined;

    if (!requiredEnvVar || requiredEnvVar?.trim() === "") {
      throw envName + " environment variable must be set!";
    }

    return requiredEnvVar;
  }
}
