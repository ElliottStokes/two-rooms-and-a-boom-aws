import {deletePlayer} from '../deletePlayer';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_PLAYER_ID = '123-abc';

describe('deletePlayer', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockReturnValue({rowCount: 1});
  });

  it('should call client with get player details statement', async () => {
    await deletePlayer(MOCK_PLAYER_ID);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'DELETE FROM two_rooms_and_a_boom.player WHERE playerid = $1',
      [MOCK_PLAYER_ID],
    );
  });

  it('should return true when player is deleted', async () => {
    CLIENT_MOCK.query.mockReturnValue({rowCount: 1});
    const result = await deletePlayer(MOCK_PLAYER_ID);
    expect(result).toBeTruthy();
  });

  it('should return null when no player is found', async () => {
    CLIENT_MOCK.query.mockResolvedValue({rowCount: 0});
    const result = await deletePlayer(MOCK_PLAYER_ID);
    expect(result).toBeFalsy();
  });
});
