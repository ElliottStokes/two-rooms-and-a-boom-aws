import {randomUUID} from 'crypto';

import {getClient} from '../../client';
import {getGameId} from '../getGameId';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_GAME_ID = randomUUID();

describe('getGameId', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({
      rowCount: 1,
      rows: [{gameid: MOCK_GAME_ID}],
    });
  });

  it('should call getClient function', async () => {
    await getGameId();
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with query', async () => {
    await getGameId();
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'SELECT gameid FROM two_rooms_and_a_boom.gameState;',
    );
  });

  it('should return with game ID', async () => {
    const gameId = await getGameId();
    expect(gameId).toBe(MOCK_GAME_ID);
  });

  it('should return null when no rows are returned', async () => {
    CLIENT_MOCK.query.mockResolvedValue({rowCount: 0, rows: []});
    const gameId = await getGameId();
    expect(gameId).toBeNull();
  });

  it('should return null when an undefined value is returned', async () => {
    CLIENT_MOCK.query.mockResolvedValue({});
    const gameId = await getGameId();
    expect(gameId).toBeNull();
  });
});
