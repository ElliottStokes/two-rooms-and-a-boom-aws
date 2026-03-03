import {CfnOutput, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {LogGroup, RetentionDays} from 'aws-cdk-lib/aws-logs';
import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID ?? '';
const AWS_REGION = process.env.AWS_REGION ?? '';
const DSQL_CLUSTER_ID = process.env.DSQL_CLUSTER_ID ?? '';
const DSQL_CLUSTER_ENDPOINT = process.env.DSQL_CLUSTER_ENDPOINT ?? '';

export class TwoRoomsAndABoomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const restApi = new RestApi(this, 'two-rooms-and-a-boom-api-gateway');
    const playerPath = restApi.root.addResource('player');
    playerPath
      .addResource('all')
      .addMethod('GET', createEndpoint(this, 'listAllPlayers'));
    playerPath
      .addResource('check')
      .addResource('{username}')
      .addMethod('GET', createEndpoint(this, 'checkPlayerCredentials'));
    playerPath.addMethod('POST', createEndpoint(this, 'registerNewPlayer'));
    playerPath
      .addResource('card')
      .addResource('{cardId}')
      .addMethod(
        'GET',
        createEndpoint(this, 'getCardImageUrl', [
          new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: ['arn:aws:s3:::two-rooms-and-a-boom/cards/*'],
          }),
        ]),
      );

    const playerPathPlayerId = playerPath.addResource('{playerId}');
    playerPathPlayerId.addMethod(
      'GET',
      createEndpoint(this, 'getPlayerDetails'),
    );
    playerPathPlayerId.addMethod(
      'DELETE',
      createEndpoint(this, 'deletePlayer'),
    );

    const cardsPath = restApi.root.addResource('cards');
    cardsPath
      .addResource('set')
      .addMethod('PATCH', createEndpoint(this, 'setActiveCards'));
    cardsPath
      .addResource('clear')
      .addMethod('PATCH', createEndpoint(this, 'clearActiveCards'));
    cardsPath
      .addResource('deal')
      .addMethod('PATCH', createEndpoint(this, 'assignPlayers'));

    const gamePath = restApi.root.addResource('game');
    gamePath
      .addResource('start')
      .addMethod('PATCH', createEndpoint(this, 'startGame'));
    gamePath
      .addResource('end')
      .addMethod('PATCH', createEndpoint(this, 'endGame'));

    new CfnOutput(this, 'ApiGatewayUrl', {value: restApi.url});
  }
}

function createEndpoint(
  scope: Construct,
  functionName: string,
  permissions?: PolicyStatement[],
) {
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
  if (permissions) {
    permissions.forEach(permission =>
      endpointFunction.addToRolePolicy(permission),
    );
  }
  return new LambdaIntegration(endpointFunction);
}
