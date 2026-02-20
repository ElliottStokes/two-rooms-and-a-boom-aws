import {Player} from '../../types';
import {getClient} from '../client';

async function assignPlayers(players: Player[], gameId: string) {
  const client = await getClient();

  await client.query(
    'DELETE FROM two_rooms_and_a_boom.game WHERE gameid = $1',
    [gameId],
  );

  const formattedPlayers = players
    .map(
      ({id, cardId, room}) => `('${id}', '${cardId}', '${room}', '${gameId}')`,
    )
    .join(', ');
  await client.query(
    `INSERT INTO two_rooms_and_a_boom.game (playerid, cardid, room, gameid) VALUES ${formattedPlayers};`,
  );
  return;
}

export {assignPlayers};
