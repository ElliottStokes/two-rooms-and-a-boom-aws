import {deletePlayer} from '../../dao';

import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

async function handler({
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!pathParameters || !pathParameters.playerId) {
    return {statusCode: 400, body: ''};
  }
  const {playerId} = pathParameters;
  const isDeleted = await deletePlayer(playerId);
  if (isDeleted) {
    return {statusCode: 204, body: ''};
  }
  return {
    statusCode: 404,
    headers: {'Content-Type': 'text/plain'},
    body: 'Player does not exist',
  };
}

export {handler};
