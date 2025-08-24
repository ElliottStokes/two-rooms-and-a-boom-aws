import { APIGatewayProxyEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';

import { createNewPlayer, getPlayerDetailsFromUsername } from '../../dao';

const logger = new Logger();

async function handler({ body }: APIGatewayProxyEvent) {
  if (!body) {
    return { statusCode: 400, body: 'Missing body from request' };
  }
  const { username } = JSON.parse(body);
  if (!username) {
    return { statusCode: 400, body: 'Missing username from request' };
  }

  try {
    const existingPlayer = await getPlayerDetailsFromUsername(username);
    if (existingPlayer) {
      return { statusCode: 200, body: JSON.stringify(existingPlayer) };
    }
  } catch (error) {
    logger.error(
      'Error while fetching existing player details',
      { error: JSON.parse(JSON.stringify(error)) },
    );
    return { statusCode: 500, body: 'Something went wrong' };
  }

  try {
    const newPlayer = await createNewPlayer(username);
    return { statusCode: 201, body: JSON.stringify(newPlayer) };
  } catch (error) {
    logger.error(
      'Error while creating new player',
      { error: JSON.parse(JSON.stringify(error)) },
    );
    return { statusCode: 500, body: 'Something went wrong' };
  }  
}

export { handler };
