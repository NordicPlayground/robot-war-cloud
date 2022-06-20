import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as IAM from "aws-cdk-lib/aws-iam";
import * as IoT from "aws-cdk-lib/aws-iot";
import { CfnPolicy } from "aws-cdk-lib/aws-iot";

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

    // User needs to be able to access IoT Core to see endpoint
    user.addToPolicy(
      new IAM.PolicyStatement({
        actions: ["iot:DescribeEndpoint"],
        resources: ["*"],
      })
    );

    // Policy for game controllers
    const gameControllerPolicy = new CfnPolicy(this, "thingPolicy", {
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["iot:Connect"],
            Resource: ["arn:aws:iot:*:*:client/${iot:ClientId}"],
            Condition: {
              Bool: {
                "iot:Connection.Thing.IsAttached": [true],
              },
            },
          },
          {
            Effect: "Allow",
            Action: ["iot:Receive"],
            Resource: ["*"],
          },
          {
            Effect: "Allow",
            Action: ["iot:Subscribe"],
            Resource: [
              "arn:aws:iot:*:*:topicfilter/$aws/things/${iot:ClientId}/*",
              "arn:aws:iot:*:*:topicfilter/${iot:ClientId}/*",
            ],
          },
          {
            Effect: "Allow",
            Action: ["iot:Publish"],
            Resource: [
              "arn:aws:iot:*:*:topic/$aws/things/${iot:ClientId}/*",
              "arn:aws:iot:*:*:topic/${iot:ClientId}/*",
            ],
          },
        ],
      },
    });
    new CfnOutput(this, "gameControllerPolicyArn", {
      value: gameControllerPolicy.attrArn,
      exportName: `${this.stackName}:gameControllerPolicyArn`,
    });

    // Manual steps needed (can be done through custom resources and just in time provisioning):
    // - create "game controller" thing group
    // - attach above policy to thing group
    // - create one or more game controller things and certificates
    // - assign game controller things to thing group (so they inherit the permission from the group)

    // User needs to be able to list things
    user.addToPolicy(
      new IAM.PolicyStatement({
        actions: ["iot:ListThings"],
        resources: ["*"],
      })
    );

    // User needs to be able to write to thing shadows
    user.addToPolicy(
      new IAM.PolicyStatement({
        actions: [
          "iot:GetThingShadow",
          "iot:UpdateThingShadow",
          "iot:DeleteThingShadow",
        ],
        resources: ["*"],
      })
    );

    // For the websocket connection to AWS IoT Core from the browser
    user.addToPolicy(
      new IAM.PolicyStatement({
        actions: ["iot:Connect"],
        resources: ["arn:aws:iot:*:*:client/user-*"],
      })
    );
    // ... and send and receive messages
    user.addToPolicy(
      new IAM.PolicyStatement({
        actions: ["iot:Receive", "iot:Subscribe", "iot:Publish"],
        resources: ["*"],
      })
    );
  }
}
