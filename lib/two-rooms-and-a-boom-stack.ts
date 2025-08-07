import { aws_lambda, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID ?? '';
const AWS_REGION = process.env.AWS_REGION ?? '';
const DSQL_CLUSTER_ID = process.env.DSQL_CLUSTER_ID ?? '';

export class TwoRoomsAndABoomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const setActiveCards = new NodejsFunction(this, 'setActiveCards', {
      functionName: 'setActiveCards',
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
      entry: 'src/functions/setActiveCards/index.ts'
    });

    setActiveCards.addToRolePolicy(new PolicyStatement({
      actions: ['dsql:DbConnectAdmin'],
      resources: [`arn:aws:dsql:${AWS_REGION}:${AWS_ACCOUNT_ID}:cluster/${DSQL_CLUSTER_ID}`],
    }))
    const setActiveCardsUrl = setActiveCards.addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "setActiveCardsUrlOutput", { value: setActiveCardsUrl.url })
  }
}
