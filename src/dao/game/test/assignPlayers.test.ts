import {randomUUID} from 'crypto';

import {getClient} from '../../client';
import {assignPlayers} from '../assignPlayers';

import type {Player} from '../../../types';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_PLAYERS: Player[] = [
  {
    id: 'test-id-1',
    username: 'test-player-1',
    cardId: 'test-card-1',
    room: 'A',
  },
  {
    id: 'test-id-2',
    username: 'test-player-2',
    cardId: 'test-card-2',
    room: 'B',
  },
  {
    id: 'test-id-3',
    username: 'test-player-3',
    cardId: 'test-card-3',
    room: 'A',
  },
  {
    id: 'test-id-4',
    username: 'test-player-4',
    cardId: 'test-card-4',
    room: 'B',
  },
  {
    id: 'test-id-5',
    username: 'test-player-5',
    cardId: 'test-card-5',
    room: 'A',
  },
  {
    id: 'test-id-6',
    username: 'test-player-6',
    cardId: 'test-card-6',
    room: 'B',
  },
];
const MOCK_GAME_ID = randomUUID();

describe('assignPlayers', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({});
  });

  it('should call getClient function', async () => {
    await assignPlayers(MOCK_PLAYERS, MOCK_GAME_ID);
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with DELETE query', async () => {
    await assignPlayers(MOCK_PLAYERS, MOCK_GAME_ID);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'DELETE FROM two_rooms_and_a_boom.game WHERE gameid = $1',
      [MOCK_GAME_ID],
    );
  });

  it('should call Client with INSERT query', async () => {
    await assignPlayers(MOCK_PLAYERS, MOCK_GAME_ID);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'INSERT INTO two_rooms_and_a_boom.game (playerid, cardid, room, gameid) VALUES ' +
        `('${MOCK_PLAYERS[0].id}', '${MOCK_PLAYERS[0].cardId}', '${MOCK_PLAYERS[0].room}', '${MOCK_GAME_ID}'), ` +
        `('${MOCK_PLAYERS[1].id}', '${MOCK_PLAYERS[1].cardId}', '${MOCK_PLAYERS[1].room}', '${MOCK_GAME_ID}'), ` +
        `('${MOCK_PLAYERS[2].id}', '${MOCK_PLAYERS[2].cardId}', '${MOCK_PLAYERS[2].room}', '${MOCK_GAME_ID}'), ` +
        `('${MOCK_PLAYERS[3].id}', '${MOCK_PLAYERS[3].cardId}', '${MOCK_PLAYERS[3].room}', '${MOCK_GAME_ID}'), ` +
        `('${MOCK_PLAYERS[4].id}', '${MOCK_PLAYERS[4].cardId}', '${MOCK_PLAYERS[4].room}', '${MOCK_GAME_ID}'), ` +
        `('${MOCK_PLAYERS[5].id}', '${MOCK_PLAYERS[5].cardId}', '${MOCK_PLAYERS[5].room}', '${MOCK_GAME_ID}');`,
    );
  });
});
