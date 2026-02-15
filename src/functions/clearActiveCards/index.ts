import {Logger} from '@aws-lambda-powertools/logger';

import {resetActiveCards} from '../../dao';

const logger = new Logger();

async function handler() {
  try {
    await resetActiveCards();
    return {statusCode: 200};
  } catch (error) {
    logger.error('Error occurred while resetting active cards', {
      error: JSON.parse(JSON.stringify(error)),
    });
    return {statusCode: 500, body: 'Something went wrong'};
  }
}

export {handler};
