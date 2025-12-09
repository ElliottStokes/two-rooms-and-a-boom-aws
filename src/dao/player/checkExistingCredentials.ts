import { getClient } from '../client';

import type { Player } from '../../types';

async function checkExistingCredentials(username: string): Promise<Player | null> {
  const client = await getClient();
  const result = await client.query(`SELECT playerId FROM two_rooms_and_a_boom.player WHERE username = ${username};`);
  if (result.rowCount && result.rowCount > 0) {
    return { id: result.rows[0].playerId, username };
  }
  return null;
}

export { checkExistingCredentials };
