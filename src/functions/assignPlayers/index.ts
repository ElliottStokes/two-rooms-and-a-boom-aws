import {
  assignPlayers,
  getActiveCards,
  getGameId,
  listAllPlayers,
} from '../../dao';
import {dealCards} from './utils';

import type {Room} from '../../types';

let NEXT_ROOM: Room = 'A';

async function handler() {
  const gameId = await getGameId();
  if (gameId === null) {
    return {statusCode: 428, body: 'Game has not been created yet'};
  }

  const unassignedPlayers = await listAllPlayers();
  const {basicCards, uniqueCards} = await getActiveCards();

  const gamblerIndex = uniqueCards.findIndex(({title}) => title === 'Gambler');
  if (gamblerIndex >= 0 && unassignedPlayers.length % 2 === 0) {
    uniqueCards.splice(gamblerIndex, 1);
  }

  const assignedPlayers = dealCards(unassignedPlayers, uniqueCards, basicCards);
  assignedPlayers.forEach(player => (player.room = assignRoom()));
  await assignPlayers(assignedPlayers, gameId);
  return {statusCode: 204};
}

function assignRoom() {
  const room = NEXT_ROOM;
  NEXT_ROOM = NEXT_ROOM === 'A' ? 'B' : 'A';
  return room;
}

export {handler};
