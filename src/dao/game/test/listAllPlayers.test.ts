import {getClient} from '../../client';
import {listAllPlayers} from '../listAllPlayers';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

describe('listAllPlayers', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({});
  });

  it('should call getClient function', async () => {
    await listAllPlayers();
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with query function', async () => {
    await listAllPlayers();
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'SELECT playerid as id, username FROM two_rooms_and_a_boom.player;',
    );
  });

  it('should return list of players on successful DB matches', async () => {
    const testPlayers = [
      {playerid: 'abc-123', username: 'test-player-1'},
      {playerid: 'def-456', username: 'test-player-2'},
      {playerid: 'ghi-789', username: 'test-player-3'},
    ];
    CLIENT_MOCK.query.mockResolvedValue({rows: testPlayers});
    const result = await listAllPlayers();
    expect(result).toStrictEqual(testPlayers);
  });

  it('should return empty list if nothing matches in DB', async () => {
    CLIENT_MOCK.query.mockResolvedValue({rows: []});
    const result = await listAllPlayers();
    expect(result).toStrictEqual([]);
  });
});
