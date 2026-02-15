import { getClient } from '../client';

import type { Player } from '../../types';

async function createNewPlayer(username: string): Promise<Player> {
  const client = await getClient();
  await client.query('INSERT INTO two_rooms_and_a_boom.player (username) VALUES ($1);', [username]);
  const result = await client.query('SELECT playerId FROM two_rooms_and_a_boom.player WHERE username = $1;', [username]);
  return { id: result.rows[0].playerId, username };
}

export { createNewPlayer };
