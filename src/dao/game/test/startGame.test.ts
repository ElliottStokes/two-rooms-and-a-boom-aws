import {randomUUID} from 'crypto';

import {getClient} from '../../client';
import {startGame} from '../startGame';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_GAME_ID = randomUUID();

describe('startGame', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({});
  });

  it('should call getClient function', async () => {
    await startGame(MOCK_GAME_ID);
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with query', async () => {
    await startGame(MOCK_GAME_ID);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      "UPDATE two_rooms_and_a_boom.gameState SET gamestate = 'IN_PROGRESS' WHERE gameid = $1;",
      [MOCK_GAME_ID],
    );
  });
});
