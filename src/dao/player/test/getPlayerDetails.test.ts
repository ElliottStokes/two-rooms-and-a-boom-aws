import {getPlayerDetails} from '../getPlayerDetails';

import type {Player} from '../../../types';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_PLAYER_ID = '123-abc';
const MOCK_PLAYER_DETAILS: Player = {
  id: MOCK_PLAYER_ID,
  username: 'test-player',
  cardId: '987-xyz',
  room: 'A',
};

describe('getPlayerDetails', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockReturnValue({
      rowCount: 1,
      rows: [
        {
          username: MOCK_PLAYER_DETAILS.username,
          cardid: MOCK_PLAYER_DETAILS.cardId,
          room: MOCK_PLAYER_DETAILS.room,
        },
      ],
    });
  });

  it('should call client with get player details statement', async () => {
    await getPlayerDetails(MOCK_PLAYER_ID);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'SELECT p.username, c.cardid, g.room FROM two_rooms_and_a_boom.game g ' +
        'LEFT JOIN two_rooms_and_a_boom.player p ON g.playerid = p.playerid ' +
        'LEFT JOIN two_rooms_and_a_boom.card c ON g.cardid = c.cardid ' +
        'WHERE g.playerid = $1',
      [MOCK_PLAYER_ID],
    );
  });

  it('should return players details', async () => {
    const result = await getPlayerDetails(MOCK_PLAYER_ID);
    expect(result).toStrictEqual(MOCK_PLAYER_DETAILS);
  });

  it('should return null when no player is found', async () => {
    CLIENT_MOCK.query.mockResolvedValue({rowCount: 0, rows: []});
    const result = await getPlayerDetails(MOCK_PLAYER_ID);
    expect(result).toBeNull();
  });
});
