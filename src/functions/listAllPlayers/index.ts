import {listAllPlayers} from '../../dao';
import {DEFAULT_CORS_HEADERS} from '../constants';

import type {APIGatewayProxyResult} from 'aws-lambda';

async function handler(): Promise<APIGatewayProxyResult> {
  const players = await listAllPlayers();
  return {
    statusCode: 200,
    headers: {'Content-Type': 'text/json', ...DEFAULT_CORS_HEADERS},
    body: JSON.stringify(players),
  };
}

export {handler};
