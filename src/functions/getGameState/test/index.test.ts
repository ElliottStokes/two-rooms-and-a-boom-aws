import {randomUUID} from 'crypto';

import {handler} from '..';
import {getGameId, getGameState} from '../../../dao';

jest.mock('../../../dao', () => ({
  getGameId: jest.fn(),
  getGameState: jest.fn(),
}));

const MOCK_GAME_ID = randomUUID();

describe('assignPlayers', () => {
  beforeEach(() => {
    jest.mocked(getGameId).mockResolvedValue(MOCK_GAME_ID);
    jest.mocked(getGameState).mockResolvedValue('WAITING_FOR_HOST');
  });

  it('should call getGameId dao function once', async () => {
    await handler();
    expect(getGameId).toHaveBeenCalledTimes(1);
  });

  it('should call getGameState dao function once', async () => {
    await handler();
    expect(getGameState).toHaveBeenCalledTimes(1);
  });

  it('should return status code 200', async () => {
    const response = await handler();
    expect(response.statusCode).toBe(200);
  });

  it('should return game state in response body', async () => {
    const response = await handler();
    expect(JSON.parse(response.body)).toStrictEqual({
      gameState: 'WAITING_FOR_HOST',
    });
  });

  it('should return status code 428 when getGameId dao function returns null', async () => {
    jest.mocked(getGameId).mockResolvedValue(null);
    const response = await handler();
    expect(response.statusCode).toBe(428);
  });
});
