import { getClient } from '../../client';
import { getPlayerDetailsFromUsername } from '../getPlayerDetailsFromUsername';

const MOCK_PLAYER_ID = crypto.randomUUID();
const MOCK_USERNAME = 'testPlayer';
const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};

jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => (CLIENT_MOCK)),
}));

describe('getPlayerDetailsFromUsername', () => {
  beforeEach(() => {
    CLIENT_MOCK.query = jest.fn().mockResolvedValue({
      rows: [{ playerid: MOCK_PLAYER_ID }],
      rowCount: 1,
    });
  });

  it('should call getClient function', async () => {
    await getPlayerDetailsFromUsername(MOCK_USERNAME);
    expect(getClient).toHaveBeenCalled();
  });

  it('should call query with correct parameters', async () => {
    await getPlayerDetailsFromUsername(MOCK_USERNAME);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'SELECT playerId, username FROM two_rooms_and_a_boom.player WHERE username = $1;',
      [MOCK_USERNAME],
    );
  });

  it('should return Player when username matches to player details', async () => {
    const player = await getPlayerDetailsFromUsername(MOCK_USERNAME);
    expect(player).toStrictEqual({
      id: MOCK_PLAYER_ID,
      username: MOCK_USERNAME,
    });
  });

  it('should return null when username does not match any player details', async () => {
    CLIENT_MOCK.query = jest.fn().mockImplementation(() => ({ rows: [], rowCount: 0 }));
    const player = await getPlayerDetailsFromUsername(MOCK_USERNAME);
    expect(player).toBe(null);
  });
});
