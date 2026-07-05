import {getGameId, getGameState} from '../../dao';

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
    headers: {'Content-Type': 'text/json'},
    body: JSON.stringify({gameState}),
  };
}

export {handler};
