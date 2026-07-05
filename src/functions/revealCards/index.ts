import {getGameId, revealCards} from '../../dao';
import {DEFAULT_CORS_HEADERS} from '../constants';

async function handler() {
  const gameId = await getGameId();

  if (gameId === null) {
    return {
      statusCode: 428,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: 'Game has not been created yet',
    };
  }

  await revealCards(gameId);
  return {
    statusCode: 200,
    headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
    body: '',
  };
}

export {handler};
