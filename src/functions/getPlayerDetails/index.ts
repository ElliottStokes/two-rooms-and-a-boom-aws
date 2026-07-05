import {getPlayerDetails} from '../../dao';

import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

async function handler({
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!pathParameters || !pathParameters.playerId) {
    return {statusCode: 400, body: ''};
  }
  const {playerId} = pathParameters;
  const playerDetails = await getPlayerDetails(playerId);

  if (playerDetails === null) {
    return {
      statusCode: 404,
      headers: {'Content-Type': 'text/plain'},
      body: 'Player does not exist',
    };
  }
  return {
    statusCode: 200,
    headers: {'Content-Type': 'text/json'},
    body: JSON.stringify(playerDetails),
  };
}

export {handler};
