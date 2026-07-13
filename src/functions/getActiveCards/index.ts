import {Logger} from '@aws-lambda-powertools/logger';

import {getActiveCards} from '../../dao';
import {DEFAULT_CORS_HEADERS} from '../constants';

const logger = new Logger();

async function handler() {
  try {
    const activeCards = await getActiveCards();
    return {
      statusCode: 200,
      headers: {'Content-Type': 'text/json', ...DEFAULT_CORS_HEADERS},
      body: JSON.stringify({...activeCards}),
    };
  } catch (error) {
    logger.error('Error occurred while fetching active cards', {
      error: JSON.parse(JSON.stringify(error)),
    });
    return {
      statusCode: 500,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: 'Something went wrong',
    };
  }
}

export {handler};
