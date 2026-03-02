import {getClient} from '../client';

async function deletePlayer(playerId: string): Promise<boolean> {
  const client = await getClient();
  const result = await client.query(
    'DELETE FROM two_rooms_and_a_boom.player g WHERE g.playerid = $1',
    [playerId],
  );
  console.log({...result});
  const {rowCount} = result;
  return rowCount !== null && rowCount > 0;
}

export {deletePlayer};
