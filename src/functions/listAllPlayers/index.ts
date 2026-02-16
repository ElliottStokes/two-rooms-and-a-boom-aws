import {listAllPlayers} from '../../dao';

async function handler() {
  const players = await listAllPlayers();
  return {statusCode: 200, body: {players}};
}

export {handler};
