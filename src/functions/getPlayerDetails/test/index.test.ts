import {handler} from '..';
import {getPlayerDetails} from '../../../dao';

import type {APIGatewayProxyEvent} from 'aws-lambda';
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
const MOCK_REQUEST_EVENT: APIGatewayProxyEvent = {
  pathParameters: {playerId: MOCK_PLAYER.id},
} as unknown as APIGatewayProxyEvent;

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
    expect(body).toStrictEqual(JSON.stringify(MOCK_PLAYER));
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
