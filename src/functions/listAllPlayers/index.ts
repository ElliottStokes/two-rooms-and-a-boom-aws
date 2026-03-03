import {listAllPlayers} from '../../dao';

import type {APIGatewayProxyResult} from 'aws-lambda';

async function handler(): Promise<APIGatewayProxyResult> {
  const players = await listAllPlayers();
  return {
    statusCode: 200,
    headers: {'Content-Type': 'text/json'},
    body: JSON.stringify(players),
  };
}

export {handler};
