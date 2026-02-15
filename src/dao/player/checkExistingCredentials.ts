import {getClient} from '../client';

import type {Player} from '../../types';

async function checkExistingCredentials(
  username: string,
): Promise<Player | null> {
  const client = await getClient();
  const result = await client.query(
    'SELECT playerid FROM two_rooms_and_a_boom.player WHERE username = $1;',
    [username],
  );
  if (result.rowCount && result.rowCount > 0) {
    return {id: result.rows[0].playerid, username};
  }
  return null;
}

export {checkExistingCredentials};
