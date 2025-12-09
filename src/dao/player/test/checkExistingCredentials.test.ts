import { randomUUID } from 'crypto';
import { checkExistingCredentials } from '../checkExistingCredentials';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => (CLIENT_MOCK))
}));

const TEST_USERNAME = 'test-user';

describe('checkExistingCredentials', () => {
  it('should call client with username statement', async () => {
    CLIENT_MOCK.query.mockReturnValue({});
    await checkExistingCredentials(TEST_USERNAME);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      `SELECT playerId FROM two_rooms_and_a_boom.player WHERE username = ${TEST_USERNAME};`
    );
  });

  it('should return player ID from matched row', async () => {
    const mockPlayerId = randomUUID();
    CLIENT_MOCK.query.mockReturnValue({ rowCount: 1, rows: [{ playerId: mockPlayerId }]});
    const result = await checkExistingCredentials(TEST_USERNAME);
    expect(result).toStrictEqual({ id: mockPlayerId, username: TEST_USERNAME });
  });

  it('should return null for no matched rows', async () => {
    CLIENT_MOCK.query.mockReturnValue({});
    const result = await checkExistingCredentials(TEST_USERNAME);
    expect(result).toBeNull();
  });
});
