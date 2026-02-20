import {getGameId, startGame} from '../../dao';

async function handler() {
  const gameId = await getGameId();

  if (gameId === null) {
    return {statusCode: 428, body: 'Game has not been created yet'};
  }

  await startGame(gameId);
  return {statusCode: 200};
}

export {handler};
