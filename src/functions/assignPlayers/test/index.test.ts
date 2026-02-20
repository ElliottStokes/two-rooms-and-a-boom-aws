import {randomUUID} from 'crypto';

import {handler} from '..';
import {
  getActiveCards,
  getGameId,
  listAllPlayers,
  assignPlayers,
} from '../../../dao';

import type {Card, Player} from '../../../types';

const ASSIGN_PLAYERS_MOCK = jest.fn();

jest.mock('../../../dao', () => ({
  getGameId: jest.fn(),
  listAllPlayers: jest.fn(),
  getActiveCards: jest.fn(),
  assignPlayers: jest
    .fn()
    .mockImplementation((assignedPlayers, gameId) =>
      ASSIGN_PLAYERS_MOCK(assignedPlayers, gameId),
    ),
}));

const MOCK_GAME_ID = randomUUID();
const MOCK_PLAYERS: Player[] = [
  {id: 'test-id-1', username: 'test-player-1'},
  {id: 'test-id-2', username: 'test-player-2'},
  {id: 'test-id-3', username: 'test-player-3'},
  {id: 'test-id-4', username: 'test-player-4'},
  {id: 'test-id-5', username: 'test-player-5'},
  {id: 'test-id-6', username: 'test-player-6'},
];
const MOCK_EXTRA_PLAYER: Player[] = [
  {id: 'test-id-extra', username: 'test-player-extra'},
];
const MOCK_ACTIVE_CARDS: {basicCards: Card[]; uniqueCards: Card[]} = {
  basicCards: [
    {id: 'abc-123', title: 'Blue Team', teamId: 'team-1'},
    {id: 'jkl-135', title: 'Red Team', teamId: 'team-2'},
  ],
  uniqueCards: [
    {id: 'def-456', title: 'test-card-1', teamId: 'team-1'},
    {id: 'ghi-789', title: 'test-card-2', teamId: 'team-1'},
    {id: 'jkm-246', title: 'test-card-3', teamId: 'team-2'},
    {id: 'gambler-id', title: 'Gambler', teamId: 'team-3'},
  ],
};

describe('assignPlayers', () => {
  beforeEach(() => {
    jest.mocked(getGameId).mockResolvedValue(MOCK_GAME_ID);
    jest.mocked(listAllPlayers).mockResolvedValue([...MOCK_PLAYERS]);
    jest.mocked(getActiveCards).mockResolvedValue({
      basicCards: [...MOCK_ACTIVE_CARDS.basicCards],
      uniqueCards: [...MOCK_ACTIVE_CARDS.uniqueCards],
    });
    ASSIGN_PLAYERS_MOCK.mockResolvedValue({});
  });

  it('should call getGameId dao function once', async () => {
    await handler();
    expect(getGameId).toHaveBeenCalledTimes(1);
  });

  describe('when getGameId returns null', () => {
    beforeEach(() => {
      jest.mocked(getGameId).mockResolvedValue(null);
    });

    it('should return status code 428', async () => {
      const response = await handler();
      expect(response.statusCode).toBe(428);
    });

    it('should call listAllPlayers dao function once', async () => {
      await handler();
      expect(listAllPlayers).not.toHaveBeenCalled();
    });

    it('should call getActiveCards dao function once', async () => {
      await handler();
      expect(getActiveCards).not.toHaveBeenCalled();
    });

    it('should call assignPlayers dao function once', async () => {
      await handler();
      expect(assignPlayers).not.toHaveBeenCalled();
    });
  });

  it('should call listAllPlayers dao function once', async () => {
    await handler();
    expect(listAllPlayers).toHaveBeenCalledTimes(1);
  });

  it('should call getActiveCards dao function once', async () => {
    await handler();
    expect(getActiveCards).toHaveBeenCalledTimes(1);
  });

  it('should call assignPlayers dao function once', async () => {
    await handler();
    expect(assignPlayers).toHaveBeenCalledTimes(1);
  });

  it('should call assignPlayers the game ID', async () => {
    await handler();
    expect(assignPlayers).toHaveBeenCalledWith(expect.any(Array), MOCK_GAME_ID);
  });

  it('should call assignPlayers a player with the gambler for odd number of players', async () => {
    jest
      .mocked(listAllPlayers)
      .mockResolvedValue([...MOCK_PLAYERS, ...MOCK_EXTRA_PLAYER]);

    await handler();
    const [assignedPlayers]: [Player[], string] =
      ASSIGN_PLAYERS_MOCK.mock.calls[0];

    expect(
      assignedPlayers.filter(({cardId}) => cardId === 'gambler-id').length,
    ).toBe(1);
  });

  it('should call assignPlayers a player without the gambler for even number of players', async () => {
    await handler();
    const [assignedPlayers]: [Player[], string] =
      ASSIGN_PLAYERS_MOCK.mock.calls[0];

    expect(
      assignedPlayers.filter(({cardId}) => cardId === 'gambler-id').length,
    ).toBe(0);
  });

  it('should call assignPlayers with equal distribution of rooms', async () => {
    await handler();
    const [assignedPlayers]: [Player[], string] =
      ASSIGN_PLAYERS_MOCK.mock.calls[0];
    const playersInRoomA = assignedPlayers.filter(
      ({room}) => room === 'A',
    ).length;
    const playersInRoomB = assignedPlayers.filter(
      ({room}) => room === 'B',
    ).length;
    expect(playersInRoomA).toBe(playersInRoomB);
  });

  it('should call assignPlayers with an extra player in room B for odd number of players', async () => {
    jest
      .mocked(listAllPlayers)
      .mockResolvedValue([...MOCK_PLAYERS, ...MOCK_EXTRA_PLAYER]);

    await handler();
    const [assignedPlayers]: [Player[], string] =
      ASSIGN_PLAYERS_MOCK.mock.calls[0];
    const playersInRoomA = assignedPlayers.filter(
      ({room}) => room === 'A',
    ).length;
    const playersInRoomB = assignedPlayers.filter(
      ({room}) => room === 'B',
    ).length;
    expect(playersInRoomB).toBe(playersInRoomA + 1);
  });

  it('should return statusCode 204 on a successful run', async () => {
    const {statusCode} = await handler();
    expect(statusCode).toBe(204);
  });
});
