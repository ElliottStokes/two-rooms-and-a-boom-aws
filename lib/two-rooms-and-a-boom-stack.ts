import {CfnOutput, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Runtime, FunctionUrlAuthType} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {LogGroup, RetentionDays} from 'aws-cdk-lib/aws-logs';

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID ?? '';
const AWS_REGION = process.env.AWS_REGION ?? '';
const DSQL_CLUSTER_ID = process.env.DSQL_CLUSTER_ID ?? '';
const DSQL_CLUSTER_ENDPOINT = process.env.DSQL_CLUSTER_ENDPOINT ?? '';

export class TwoRoomsAndABoomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    createEndpoint(this, 'setActiveCards');
    createEndpoint(this, 'clearActiveCards');
    createEndpoint(this, 'registerNewPlayer');
    createEndpoint(this, 'listAllPlayers');
    createEndpoint(this, 'assignPlayers');
    createEndpoint(this, 'startGame');
  }
}

function createEndpoint(scope: Construct, functionName: string) {
  const endpointFunction = new NodejsFunction(scope, functionName, {
    functionName,
    runtime: Runtime.NODEJS_22_X,
    handler: 'index.handler',
    entry: `src/functions/${functionName}/index.ts`,
    logGroup: new LogGroup(scope, `${functionName}LogGroup`, {
      logGroupName: `/aws/lambda/${functionName}`,
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    }),
    environment: {DSQL_CLUSTER_ENDPOINT},
  });
  endpointFunction.addToRolePolicy(
    new PolicyStatement({
      actions: ['dsql:*'],
      resources: [
        `arn:aws:dsql:${AWS_REGION}:${AWS_ACCOUNT_ID}:cluster/${DSQL_CLUSTER_ID}`,
      ],
    }),
  );
  const {url} = endpointFunction.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
  });
  new CfnOutput(scope, `${functionName}UrlOutput`, {value: url});
}
