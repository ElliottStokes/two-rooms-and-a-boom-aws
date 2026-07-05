import {randomUUID} from 'crypto';

import {getClient} from '../../client';
import {revealCards} from '../revealCards';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_GAME_ID = randomUUID();

describe('revealCards', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({});
  });

  it('should call getClient function', async () => {
    await revealCards(MOCK_GAME_ID);
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with query', async () => {
    await revealCards(MOCK_GAME_ID);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'UPDATE two_rooms_and_a_boom.gameState ' +
        "SET gamestate = 'REVEAL_CARDS', " +
        "matchEndTime = NOW() + INTERVAL '10 seconds' WHERE gameid = $1;",
      [MOCK_GAME_ID],
    );
  });
});
