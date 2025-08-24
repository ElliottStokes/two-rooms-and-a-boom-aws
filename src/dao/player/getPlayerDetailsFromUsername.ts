import { getClient } from '../client';

import type { Player } from '../../types';

async function getPlayerDetailsFromUsername(username: string): Promise<Player | null> {
  const client = await getClient();
  const { rows, rowCount } = await client.query('SELECT playerId, username FROM two_rooms_and_a_boom.player WHERE username = $1;', [username]);
  if (rowCount && rowCount > 0) {
    const { playerid } = rows[0];
    return { id: playerid, username };
  }
  return null;
}

export { getPlayerDetailsFromUsername };
