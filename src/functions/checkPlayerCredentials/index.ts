import {APIGatewayProxyEvent} from 'aws-lambda';
import {checkExistingCredentials} from '../../dao';

async function handler({body}: APIGatewayProxyEvent) {
  if (!body) {
    return {statusCode: 400, body: 'Missing body from request'};
  }

  const {username} = JSON.parse(body);
  const existingPlayer = await checkExistingCredentials(username);
  if (existingPlayer) {
    return {statusCode: 200, body: JSON.stringify(existingPlayer)};
  }
  return {statusCode: 404, body: 'Player does not exist'};
}

export {handler};
