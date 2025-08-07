import { Logger } from '@aws-lambda-powertools/logger';

import { resetActiveCards, setActiveCards } from '../../dao';

import type { APIGatewayProxyEvent } from 'aws-lambda';

const logger = new Logger();

async function handler({ body }: APIGatewayProxyEvent) {
  if (!body) {
    return { statusCode: 400, body: 'Missing body from request' };
  }
  const { activeCardNames } = JSON.parse(body);
  logger.info('Setting active card names', { activeCardNames });

  try {
    await resetActiveCards();
    await setActiveCards(activeCardNames);
    return { statusCode: 204 };  
  } catch (error) {
    logger.error('ERROR', { error: JSON.parse(JSON.stringify(error)) })
    return { statusCode: 500, body: 'Something went wrong' };
  }
}

export { handler };
