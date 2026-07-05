import {getClient} from '../client';

async function endGame(gameId: string) {
  const client = await getClient();
  await client.query(
    'UPDATE two_rooms_and_a_boom.gameState ' +
      "SET gamestate = 'WAITING_FOR_HOST' " +
      'WHERE gameid = $1;',
    [gameId],
  );
  return;
}

export {endGame};
