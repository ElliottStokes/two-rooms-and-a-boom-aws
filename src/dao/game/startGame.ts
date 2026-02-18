import {getClient} from '../client';

async function startGame(gameId: string) {
  const client = await getClient();
  await client.query(
    "UPDATE two_rooms_and_a_boom.gameState SET gamestate = 'IN_PROGRESS' WHERE gameid = $1;",
    [gameId],
  );
  return;
}

export {startGame};
