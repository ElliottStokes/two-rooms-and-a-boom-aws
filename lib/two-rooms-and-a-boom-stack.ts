import {CfnOutput, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {LogGroup, RetentionDays} from 'aws-cdk-lib/aws-logs';
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from 'aws-cdk-lib/aws-apigatewayv2';
import {HttpLambdaIntegration} from 'aws-cdk-lib/aws-apigatewayv2-integrations';

import type {HttpApiProps} from 'aws-cdk-lib/aws-apigatewayv2';

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID ?? '';
const AWS_REGION = process.env.AWS_REGION ?? '';
const DSQL_CLUSTER_ID = process.env.DSQL_CLUSTER_ID ?? '';
const DSQL_CLUSTER_ENDPOINT = process.env.DSQL_CLUSTER_ENDPOINT ?? '';

const DEFAULT_CORS_OPTIONS: HttpApiProps = {
  corsPreflight: {
    allowOrigins: ['*'],
    allowMethods: [
      CorsHttpMethod.GET,
      CorsHttpMethod.POST,
      CorsHttpMethod.PATCH,
      CorsHttpMethod.DELETE,
      CorsHttpMethod.OPTIONS,
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
  },
};

export class TwoRoomsAndABoomStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const httpApi = new HttpApi(
      this,
      'two-rooms-and-a-boom-api-gateway',
      DEFAULT_CORS_OPTIONS,
    );

    httpApi.addRoutes({
      path: '/player/all',
      methods: [HttpMethod.GET],
      integration: createEndpoint(this, 'listAllPlayers'),
    });
    httpApi.addRoutes({
      path: '/player/check/{username}',
      methods: [HttpMethod.GET],
      integration: createEndpoint(this, 'checkPlayerCredentials'),
    });
    httpApi.addRoutes({
      path: '/player',
      methods: [HttpMethod.POST],
      integration: createEndpoint(this, 'registerNewPlayer'),
    });
    httpApi.addRoutes({
      path: '/player/card/{cardId}',
      methods: [HttpMethod.GET],
      integration: createEndpoint(this, 'getCardImageUrl', [
        new PolicyStatement({
          actions: ['s3:GetObject'],
          resources: ['arn:aws:s3:::two-rooms-and-a-boom/cards/*'],
        }),
      ]),
    });
    httpApi.addRoutes({
      path: '/player/{playerId}',
      methods: [HttpMethod.GET],
      integration: createEndpoint(this, 'getPlayerDetails'),
    });
    httpApi.addRoutes({
      path: '/player/{playerId}',
      methods: [HttpMethod.DELETE],
      integration: createEndpoint(this, 'deletePlayer'),
    });

    httpApi.addRoutes({
      path: '/cards',
      methods: [HttpMethod.PATCH],
      integration: createEndpoint(this, 'setActiveCards'),
    });
    httpApi.addRoutes({
      path: '/cards/clear',
      methods: [HttpMethod.PATCH],
      integration: createEndpoint(this, 'clearActiveCards'),
    });
    httpApi.addRoutes({
      path: '/cards/deal',
      methods: [HttpMethod.PATCH],
      integration: createEndpoint(this, 'assignPlayers'),
    });

    httpApi.addRoutes({
      path: '/game/start',
      methods: [HttpMethod.PATCH],
      integration: createEndpoint(this, 'startGame'),
    });
    httpApi.addRoutes({
      path: '/game/reveal',
      methods: [HttpMethod.PATCH],
      integration: createEndpoint(this, 'revealCards'),
    });
    httpApi.addRoutes({
      path: '/game/end',
      methods: [HttpMethod.PATCH],
      integration: createEndpoint(this, 'endGame'),
    });
    httpApi.addRoutes({
      path: '/game',
      methods: [HttpMethod.GET],
      integration: createEndpoint(this, 'getGameState'),
    });

    new CfnOutput(this, 'ApiGatewayUrl', {value: httpApi.url || ''});
  }
}

function createEndpoint(
  scope: Construct,
  functionName: string,
  permissions?: PolicyStatement[],
): HttpLambdaIntegration {
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
  return new HttpLambdaIntegration(functionName, endpointFunction);
}
