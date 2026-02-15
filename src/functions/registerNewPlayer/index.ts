import { APIGatewayProxyEvent } from 'aws-lambda';
import { checkExistingCredentials, createNewPlayer } from '../../dao/player';

async function handler({ body }: APIGatewayProxyEvent) {
  if (!body) {
    return { statusCode: 400, body: 'Missing body from request' };
  }

  const { username } = JSON.parse(body);
  const existingPlayer = await checkExistingCredentials(username);
  if (existingPlayer) {
    return { statusCode: 200, body: JSON.stringify(existingPlayer) };
  }

  const newPlayer = await createNewPlayer(username);
  return { statusCode: 201, body: JSON.stringify(newPlayer) };
}

export { handler };
