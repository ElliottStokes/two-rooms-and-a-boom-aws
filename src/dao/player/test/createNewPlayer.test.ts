import { CLIENT_MOCK } from '../../../../testUtils';
import { getClient } from '../../client';
import { createNewPlayer } from '../createNewPlayer';

const MOCK_USERNAME = 'testPlayer';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('createNewPlayer', () => {
  it('should call getClient function', async () => {
    await createNewPlayer(MOCK_USERNAME);
    expect(getClient).toHaveBeenCalled();
  });

  it('should call generate a random UUID from crypto module', async () => {
    const randomUuidSpy = jest.spyOn(crypto, 'randomUUID');
    await createNewPlayer(MOCK_USERNAME);
    expect(randomUuidSpy).toHaveBeenCalled();
  });

  it('should call query with correct parameters', async () => {
    await createNewPlayer(MOCK_USERNAME);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'INSERT INTO two_rooms_and_a_boom.player (playerId, username) VALUES ($1, $2);',
      [expect.stringMatching(UUID_REGEX), MOCK_USERNAME],
    );
  });

  it('should return Player', async () => {
    const player = await createNewPlayer(MOCK_USERNAME);
    expect(player).toStrictEqual({
      id: expect.stringMatching(UUID_REGEX),
      username: MOCK_USERNAME,
    });
  });
});
