import {getClient} from '../client';

type Player = {playerid: string; username: string};

async function listAllPlayers(): Promise<Player[]> {
  const client = await getClient();
  const result = await client.query(
    'SELECT playerid, username FROM two_rooms_and_a_boom.player;',
  );
  return result.rows;
}

export {listAllPlayers};
