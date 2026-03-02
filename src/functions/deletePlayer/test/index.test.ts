import {handler} from '..';
import {deletePlayer} from '../../../dao';

jest.mock('../../../dao', () => ({
  deletePlayer: jest.fn(),
}));

const MOCK_PLAYER_ID = '123-abc';
const MOCK_REQUEST_EVENT = {
  requestContext: {
    http: {
      path: `http://2468-qwerty.lambda-url.eu-west-2.on.aws/${MOCK_PLAYER_ID}`,
    },
  },
};

describe('deletePlayer', () => {
  beforeEach(() => {
    jest.mocked(deletePlayer).mockResolvedValue(true);
  });

  it('should call getPlayerDetails dao function once', async () => {
    await handler(MOCK_REQUEST_EVENT);
    expect(deletePlayer).toHaveBeenCalledWith(MOCK_PLAYER_ID);
  });

  it('should return statusCode 204 when successfully deleting a player', async () => {
    const {statusCode} = await handler(MOCK_REQUEST_EVENT);
    expect(statusCode).toBe(204);
  });

  it('should return statusCode 404 when no player is found', async () => {
    jest.mocked(deletePlayer).mockResolvedValue(false);
    const {statusCode} = await handler(MOCK_REQUEST_EVENT);
    expect(statusCode).toBe(404);
  });
});
