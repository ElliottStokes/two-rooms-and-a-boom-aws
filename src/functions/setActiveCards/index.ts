import { Logger } from '@aws-lambda-powertools/logger';

import { resetActiveCards, setActiveCards } from '../../dao';

import type { APIGatewayProxyEvent } from 'aws-lambda';

const logger = new Logger();

async function handler({ body }: APIGatewayProxyEvent) {
  if (!body) {
    return { statusCode: 400, body: 'Missing body from request' };
  }
  const { activeCardNames } = JSON.parse(body);
  if (!activeCardNames) {
    return { statusCode: 400, body: 'missing activeCardNames from request body' };
  }

  try {
    await resetActiveCards();
    await setActiveCards(activeCardNames);
    return { statusCode: 204 };  
  } catch (error) {
    logger.error(
      'Error occured while setting active cards', 
      { error: JSON.parse(JSON.stringify(error)) }
    );
    return { statusCode: 500, body: 'Something went wrong' };
  }
}

export { handler };
