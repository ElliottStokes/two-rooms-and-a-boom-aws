import {checkExistingCredentials, createNewPlayer} from '../../dao';

import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

async function handler({
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!body) {
    return {
      statusCode: 400,
      headers: {'Content-Type': 'text/plain'},
      body: 'Missing body from request',
    };
  }

  const {username} = JSON.parse(body);
  const existingPlayer = await checkExistingCredentials(username);
  if (existingPlayer) {
    return {
      statusCode: 409,
      headers: {'Content-Type': 'text/plain'},
      body: 'player with that username already exists',
    };
  }

  const newPlayer = await createNewPlayer(username);
  return {
    statusCode: 201,
    headers: {'Content-Type': 'text/json'},
    body: JSON.stringify(newPlayer),
  };
}

export {handler};
