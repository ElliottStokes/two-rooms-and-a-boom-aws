import { getClient } from '../client';

import type { Player } from '../../types';

async function createNewPlayer(username: string): Promise<Player> {
  const client = await getClient();
  const uuid = crypto.randomUUID();
  await client.query(
    'INSERT INTO two_rooms_and_a_boom.player (playerId, username) VALUES ($1, $2);',
    [uuid, username],
  );
  return { id: uuid, username };
}

export { createNewPlayer };
