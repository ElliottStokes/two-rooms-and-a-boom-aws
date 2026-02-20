import {getClient} from '../client';

async function getGameId(): Promise<string | null> {
  const client = await getClient();
  const result = await client.query(
    'SELECT gameid FROM two_rooms_and_a_boom.gameState;',
  );
  if (result.rowCount && result.rowCount > 0) {
    return result.rows[0].gameid;
  }
  return null;
}

export {getGameId};
