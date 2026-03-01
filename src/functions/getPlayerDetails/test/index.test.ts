import {handler} from '..';
import {getPlayerDetails} from '../../../dao';

import type {Player} from '../../../types';

jest.mock('../../../dao', () => ({
  getPlayerDetails: jest.fn(),
}));

const MOCK_PLAYER: Player = {
  id: '123-abc',
  username: 'test-user',
  cardId: '987-zxy',
  room: 'A',
};
const MOCK_REQUEST_EVENT = {
  requestContext: {
    http: {
      path: `http://2468-qwerty.lambda-url.eu-west-2.on.aws/${MOCK_PLAYER.id}`,
    },
  },
};

describe('getPlayerDetails', () => {
  beforeEach(() => {
    jest.mocked(getPlayerDetails).mockResolvedValue(MOCK_PLAYER);
  });

  it('should call getPlayerDetails dao function once', async () => {
    await handler(MOCK_REQUEST_EVENT);
    expect(getPlayerDetails).toHaveBeenCalledWith(MOCK_PLAYER.id);
  });

  it('should return player details on a successful run', async () => {
    const {body} = await handler(MOCK_REQUEST_EVENT);
    expect(body).toStrictEqual(MOCK_PLAYER);
  });

  it('should return statusCode 200 on a successful run', async () => {
    const {statusCode} = await handler(MOCK_REQUEST_EVENT);
    expect(statusCode).toBe(200);
  });

  it('should return statusCode 404 when no player is found', async () => {
    jest.mocked(getPlayerDetails).mockResolvedValue(null);
    const {statusCode} = await handler(MOCK_REQUEST_EVENT);
    expect(statusCode).toBe(404);
  });
});
