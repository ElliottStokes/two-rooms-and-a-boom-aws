import {getGameId, getGameState} from '../../dao';
import {DEFAULT_CORS_HEADERS} from '../constants';

async function handler() {
  const gameId = await getGameId();
  console.log('gameId', gameId);

  if (gameId === null) {
    return {statusCode: 428, body: 'Game has not been created yet'};
  }

  const gameState = await getGameState();
  console.log('gameState', gameState);
  return {
    statusCode: 200,
    headers: {'Content-Type': 'text/json', ...DEFAULT_CORS_HEADERS},
    body: JSON.stringify({gameState}),
  };
}

export {handler};
