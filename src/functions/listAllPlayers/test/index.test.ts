import {handler} from '..';
import {listAllPlayers} from '../../../dao';

jest.mock('../../../dao', () => ({
  listAllPlayers: jest.fn(),
}));

describe('clearActiveCards', () => {
  beforeEach(() => {
    jest.mocked(listAllPlayers).mockResolvedValue([]);
  });

  it('should call resetActiveCards dao function once', async () => {
    await handler();
    expect(listAllPlayers).toHaveBeenCalled();
  });

  it('should return list of players on a successful run', async () => {
    const testPlayers = [
      {playerid: 'abc-123', username: 'test-player-1'},
      {playerid: 'def-456', username: 'test-player-2'},
      {playerid: 'ghi-789', username: 'test-player-3'},
    ];
    jest.mocked(listAllPlayers).mockResolvedValue(testPlayers);
    const {body} = await handler();
    expect(body).toStrictEqual({players: testPlayers});
  });

  it('should return statusCode 200 on a successful run', async () => {
    const {statusCode} = await handler();
    expect(statusCode).toBe(200);
  });
});
