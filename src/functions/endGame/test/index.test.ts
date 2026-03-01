import {randomUUID} from 'crypto';

import {handler} from '..';
import {getGameId, endGame} from '../../../dao';

jest.mock('../../../dao', () => ({
  getGameId: jest.fn(),
  endGame: jest.fn(),
}));

const MOCK_GAME_ID = randomUUID();

describe('assignPlayers', () => {
  beforeEach(() => {
    jest.mocked(getGameId).mockResolvedValue(MOCK_GAME_ID);
    jest.mocked(endGame).mockResolvedValue();
  });

  it('should call getGameId dao function once', async () => {
    await handler();
    expect(getGameId).toHaveBeenCalledTimes(1);
  });

  it('should call endGame dao function once', async () => {
    await handler();
    expect(endGame).toHaveBeenCalledTimes(1);
  });

  it('should return status code 200', async () => {
    const response = await handler();
    expect(response.statusCode).toBe(200);
  });

  it('should return status code 428 when getGameId dao function returns null', async () => {
    jest.mocked(getGameId).mockResolvedValue(null);
    const response = await handler();
    expect(response.statusCode).toBe(428);
  });
});
