import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as IAM from "aws-cdk-lib/aws-iam";

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const user = new IAM.User(this, "webAppUser");

    const accessKeyForWebApp = new IAM.CfnAccessKey(this, "webAppAccessKey", {
      userName: user.userName,
      status: "Active",
    });

    new CfnOutput(this, "webAppUserAccessKeyIdOutput", {
      value: accessKeyForWebApp.ref,
      exportName: `${this.stackName}:userAccessKeyId`,
    });

    new CfnOutput(this, "webAppUserSecretAccessKeyOutput", {
      value: accessKeyForWebApp.attrSecretAccessKey,
      exportName: `${this.stackName}:userSecretAccessKey`,
    });

    // User needs to be able to access IoT Core
    user.addToPolicy(
      new IAM.PolicyStatement({
        actions: ["iot:DescribeEndpoint"],
        resources: ["*"],
      })
    );
  }
}
