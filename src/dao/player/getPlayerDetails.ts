import {getClient} from '../client';

import type {Player} from '../../types';

async function getPlayerDetails(playerId: string): Promise<Player | null> {
  const client = await getClient();
  const {rowCount, rows} = await client.query(
    'SELECT p.username, c.cardid, g.room FROM two_rooms_and_a_boom.game g ' +
      'LEFT JOIN two_rooms_and_a_boom.player p ON g.playerid = p.playerid ' +
      'LEFT JOIN two_rooms_and_a_boom.card c ON g.cardid = c.cardid ' +
      'WHERE g.playerid = $1',
    [playerId],
  );
  if (rowCount && rowCount > 0) {
    const {cardid, username, room} = rows[0];
    return {id: playerId, username, cardId: cardid, room};
  }
  return null;
}

export {getPlayerDetails};
