import {getClient} from '../client';

async function endGame(gameId: string) {
  const client = await getClient();
  await client.query(
    'UPDATE two_rooms_and_a_boom.gameState ' +
      "SET gamestate = 'REVEAL_CARDS', " +
      "matchEndTime = NOW() + INTERVAL '10 seconds' WHERE gameid = $1;",
    [gameId],
  );
  return;
}

export {endGame};
