import {Logger} from '@aws-lambda-powertools/logger';

import {resetActiveCards, setActiveCards} from '../../dao';
import {DEFAULT_CORS_HEADERS} from '../constants';

import type {APIGatewayProxyEvent} from 'aws-lambda';

const logger = new Logger();

async function handler({body}: APIGatewayProxyEvent) {
  if (!body) {
    return {
      statusCode: 400,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: 'Missing body from request',
    };
  }
  const {activeCardNames} = JSON.parse(body);
  if (!activeCardNames) {
    return {
      statusCode: 400,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: 'missing activeCardNames from request body',
    };
  }

  try {
    await resetActiveCards();
    await setActiveCards(activeCardNames);
    return {
      statusCode: 204,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: '',
    };
  } catch (error) {
    logger.error('Error occurred while setting active cards', {
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
