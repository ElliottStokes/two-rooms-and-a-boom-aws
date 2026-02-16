import {getActiveCards, listAllPlayers} from '../../dao';

async function handler() {
  const players = await listAllPlayers();
  const cards = await getActiveCards();
  return {statusCode: 200, body: {players, cards}};
}

export {handler};
