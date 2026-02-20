import {dealCards} from '../dealCards';

import type {Card, Player} from '../../../../types';

const MOCK_PLAYERS: Player[] = [
  {id: 'test-id-1', username: 'test-player-1'},
  {id: 'test-id-2', username: 'test-player-2'},
  {id: 'test-id-3', username: 'test-player-3'},
  {id: 'test-id-4', username: 'test-player-4'},
  {id: 'test-id-5', username: 'test-player-5'},
  {id: 'test-id-6', username: 'test-player-6'},
];
const MOCK_BASIC_CARDS: Card[] = [
  {id: 'abc-123', title: 'Blue Team', teamId: 'team-1'},
  {id: 'jkl-135', title: 'Red Team', teamId: 'team-2'},
];
const MOCK_UNIQUE_CARDS: Card[] = [
  {id: 'def-456', title: 'test-card-1', teamId: 'team-1'},
  {id: 'ghi-789', title: 'test-card-2', teamId: 'team-1'},
  {id: 'jkm-246', title: 'test-card-3', teamId: 'team-2'},
];

describe('dealCards', () => {
  it('should only deal a single copy of unique cards', async () => {
    const assignedPlayers = dealCards(
      MOCK_PLAYERS,
      MOCK_UNIQUE_CARDS,
      MOCK_BASIC_CARDS,
    );

    for (const card of MOCK_UNIQUE_CARDS) {
      expect(
        assignedPlayers.filter(({cardId}) => cardId === card.id).length,
      ).toBe(1);
    }
  });

  it('should deal basic cards equally', async () => {
    const assignedPlayers = dealCards(MOCK_PLAYERS, [], MOCK_BASIC_CARDS);
    for (const card of MOCK_BASIC_CARDS) {
      expect(
        assignedPlayers.filter(({cardId}) => cardId === card.id).length,
      ).toBe(MOCK_PLAYERS.length / 2);
    }
  });

  describe('when there are more unique cards than players', () => {
    it('should not deal any basic cards when unique car', () => {
      const assignedPlayers = dealCards(
        [...MOCK_PLAYERS].splice(0, MOCK_UNIQUE_CARDS.length),
        MOCK_UNIQUE_CARDS,
        MOCK_BASIC_CARDS,
      );
      for (const card of MOCK_BASIC_CARDS) {
        expect(
          assignedPlayers.filter(({cardId}) => cardId === card.id).length,
        ).toBe(0);
      }
    });
  });
});
