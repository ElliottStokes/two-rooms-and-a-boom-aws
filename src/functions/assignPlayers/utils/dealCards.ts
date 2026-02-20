import {randomInt} from 'crypto';

import type {Card, Player} from '../../../types';

function dealCards(
  players: Player[],
  uniqueCards: Card[],
  basicCards: Card[],
): Player[] {
  const unassignedPlayers = [...players];
  const assignedPlayers: Player[] = [];

  dealUniqueCards(assignedPlayers, unassignedPlayers, [...uniqueCards]);
  dealBasicCards(assignedPlayers, unassignedPlayers, [...basicCards]);

  return assignedPlayers;
}

function dealUniqueCards(
  assignedPlayers: Player[],
  unassignedPlayers: Player[],
  cards: Card[],
) {
  const uniqueCardIndexes = [...Array(cards.length).keys()];
  while (uniqueCardIndexes.length > 0) {
    const randomPlayerIndex = randomInt(0, unassignedPlayers.length);
    const randomPlayer = unassignedPlayers.splice(randomPlayerIndex, 1)[0];

    const randomCardIndex = randomInt(0, uniqueCardIndexes.length);
    const {id: cardId} = cards[uniqueCardIndexes.splice(randomCardIndex, 1)[0]];

    assignedPlayers.push({...randomPlayer, cardId});
  }
}

function dealBasicCards(
  assignedPlayers: Player[],
  unassignedPlayers: Player[],
  cards: Card[],
) {
  while (unassignedPlayers.length > 0) {
    const {id: cardId} = cards[unassignedPlayers.length % 2];
    assignedPlayers.push({...unassignedPlayers.pop()!, cardId});
  }
}

export {dealCards};
