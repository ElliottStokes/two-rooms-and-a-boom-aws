import {randomInt} from 'crypto';

import {
  assignPlayers,
  getActiveCards,
  getGameId,
  listAllPlayers,
} from '../../dao';

import type {Player, Room} from '../../types';

let NEXT_ROOM: Room = 'A';

async function handler() {
  const gameId = await getGameId();

  if (gameId === null) {
    return {statusCode: 428, body: 'Game has not been created yet'};
  }

  const unassignedPlayers = await listAllPlayers();
  const {basicCards, uniqueCards} = await getActiveCards();

  const gamblerIndex = uniqueCards.findIndex(
    ({cardtitle}) => cardtitle === 'Gambler',
  );

  if (gamblerIndex >= 0 && unassignedPlayers.length % 2 === 0) {
    uniqueCards.splice(gamblerIndex, 1);
  }

  const assignedPlayers: Player[] = [];
  for (const card of uniqueCards) {
    const randomIndex = randomInt(0, unassignedPlayers.length);
    const nextPlayer = unassignedPlayers.splice(randomIndex, 1)[0];
    assignedPlayers.push({
      id: nextPlayer.playerid,
      username: nextPlayer.username,
      cardId: card.cardid,
      room: assignRoom(),
    });
  }
  while (unassignedPlayers.length > 0) {
    const nextPlayer = unassignedPlayers.pop()!;
    assignedPlayers.push({
      id: nextPlayer.playerid,
      username: nextPlayer.username,
      cardId: basicCards[unassignedPlayers.length % 2].cardid,
      room: assignRoom(),
    });
  }

  await assignPlayers(assignedPlayers, gameId);
  return {
    statusCode: 200,
    body: {players: assignedPlayers, cards: {basicCards, uniqueCards}},
  };
}

function assignRoom() {
  const room = NEXT_ROOM;
  NEXT_ROOM = NEXT_ROOM === 'A' ? 'B' : 'A';
  return room;
}

export {handler};
