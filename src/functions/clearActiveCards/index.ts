import {Logger} from '@aws-lambda-powertools/logger';
import {DEFAULT_CORS_HEADERS} from '../constants';

import {resetActiveCards} from '../../dao';

const logger = new Logger();

async function handler() {
  try {
    await resetActiveCards();
    return {statusCode: 200, headers: DEFAULT_CORS_HEADERS};
  } catch (error) {
    logger.error('Error occurred while resetting active cards', {
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
