import {deletePlayer} from '../../dao';
import {DEFAULT_CORS_HEADERS} from '../constants';

import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

async function handler({
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!pathParameters || !pathParameters.playerId) {
    return {
      statusCode: 400,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: '',
    };
  }
  const {playerId} = pathParameters;
  const isDeleted = await deletePlayer(playerId);
  if (isDeleted) {
    return {
      statusCode: 204,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: '',
    };
  }
  return {
    statusCode: 404,
    headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
    body: 'Player does not exist',
  };
}

export {handler};
