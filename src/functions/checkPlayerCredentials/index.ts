import {checkExistingCredentials} from '../../dao';

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

async function handler({
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!pathParameters || !pathParameters.username) {
    return {statusCode: 400, body: ''};
  }
  const {username} = pathParameters;
  const existingPlayer = await checkExistingCredentials(username);
  if (existingPlayer) {
    return {
      statusCode: 200,
      headers: {'Content-Type': 'text/json'},
      body: JSON.stringify(existingPlayer),
    };
  }
  return {
    statusCode: 404,
    headers: {'Content-Type': 'text/plain'},
    body: 'Player does not exist',
  };
}

export {handler};
