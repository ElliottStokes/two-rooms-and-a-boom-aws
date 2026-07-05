import {checkExistingCredentials, createNewPlayer} from '../../dao';

import {DEFAULT_CORS_HEADERS} from '../constants';

import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

async function handler({
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!body) {
    return {
      statusCode: 400,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: 'Missing body from request',
    };
  }

  const {username} = JSON.parse(body);
  const existingPlayer = await checkExistingCredentials(username);
  if (existingPlayer) {
    return {
      statusCode: 409,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: 'player with that username already exists',
    };
  }

  const newPlayer = await createNewPlayer(username);
  return {
    statusCode: 201,
    headers: {'Content-Type': 'text/json', ...DEFAULT_CORS_HEADERS},
    body: JSON.stringify(newPlayer),
  };
}

export {handler};
