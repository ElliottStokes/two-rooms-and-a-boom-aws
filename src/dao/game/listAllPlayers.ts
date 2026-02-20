import {getClient} from '../client';

import type {Player} from '../../types';

async function listAllPlayers(): Promise<Player[]> {
  const client = await getClient();
  const result = await client.query(
    'SELECT playerid as id, username FROM two_rooms_and_a_boom.player;',
  );
  return result.rows;
}

export {listAllPlayers};
