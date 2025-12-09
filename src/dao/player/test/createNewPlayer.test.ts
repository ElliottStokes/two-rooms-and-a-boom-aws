import { randomUUID } from 'crypto';
import { createNewPlayer } from '../createNewPlayer';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => (CLIENT_MOCK))
}));

const TEST_USERNAME = 'test-user';

describe('createNewPlayer', () => {
  const mockPlayerId = randomUUID();
  beforeEach(() => {
    CLIENT_MOCK.query
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ rowCount: 1, rows: [{playerId: mockPlayerId }] });
  });

  it('should call client with create new player statement', async () => {
    await createNewPlayer(TEST_USERNAME);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      `INSERT INTO two_rooms_and_a_boom.player (username) VALUES (${TEST_USERNAME});`
    );
  });

  it('should call client with fetch player statement', async () => {
    await createNewPlayer(TEST_USERNAME);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      `SELECT playerId FROM two_rooms_and_a_boom.player WHERE username = ${TEST_USERNAME};`
    );
  });

  it('should return new players playerId', async () => {
    const result = await createNewPlayer(TEST_USERNAME);
    expect(result).toStrictEqual({ id: mockPlayerId, username: TEST_USERNAME });
  })
})