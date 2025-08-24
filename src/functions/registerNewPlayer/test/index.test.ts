import { APIGatewayProxyEvent } from 'aws-lambda';

import { createNewPlayer, getPlayerDetailsFromUsername } from '../../../dao';
import { handler } from '..';

jest.mock('../../../dao', () => ({
  getPlayerDetailsFromUsername: jest.fn(),
  createNewPlayer: jest.fn(),
}));

const MOCK_USERNAME = 'testPlayer';
const MOCK_API_GATEWAY_PROXY_EVENT = {
  body: JSON.stringify({
    username: MOCK_USERNAME,
  }),
} as unknown as APIGatewayProxyEvent;

describe('registerNewPlayer', () => {
  describe('when fetching the details of an existing player', () => {
    const existingPlayerUuid = crypto.randomUUID();

    it('should return status code 200 and existing player details', async () => {
      jest.mocked(getPlayerDetailsFromUsername).mockResolvedValue({
        id: existingPlayerUuid,
        username: MOCK_USERNAME,
      });
      const response = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(response).toStrictEqual({
        statusCode: 200,
        body: JSON.stringify({ id: existingPlayerUuid, username: MOCK_USERNAME }),
      });
    });

    it('should not call createNewPlayer if existing player details are found', async () => {
      await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(createNewPlayer).not.toHaveBeenCalled();
    });

    it('should return 500 error response when getPlayerDetailsFromUsername throws an error', async () => {
      jest.mocked(getPlayerDetailsFromUsername).mockRejectedValue(
        new Error('Error getting player details from username')
      );
      const response = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(response).toStrictEqual({
        statusCode: 500,
        body: 'Something went wrong',
      })
    });
  });

  describe('when creating a new player', () => {
    beforeEach(() => {
      jest.mocked(getPlayerDetailsFromUsername).mockResolvedValue(null);
    });

    const newPlayerUuid = crypto.randomUUID();

    it('should return status code 200 and new player details', async () => {
      jest.mocked(createNewPlayer).mockResolvedValue({
        id: newPlayerUuid,
        username: MOCK_USERNAME,
      });
      const response = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(response).toStrictEqual({
        statusCode: 201,
        body: JSON.stringify({ id: newPlayerUuid, username: MOCK_USERNAME }),
      });
    });

    it('should call getPlayerDetailsFromUsername to attempt to get existing player', async () => {
      await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(getPlayerDetailsFromUsername).toHaveBeenCalledTimes(1);
    });

    it('should return 500 error response when createNewPlayer throws an error', async () => {
      jest.mocked(createNewPlayer).mockRejectedValue(
        new Error('Error while creating a new player')
      );
      const response = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(response).toStrictEqual({
        statusCode: 500,
        body: 'Something went wrong',
      });
    });
  });

  it('should return 400 error response when request is missing body', async () => {
    const response = await handler({} as unknown as APIGatewayProxyEvent);
    expect(response).toStrictEqual({
      statusCode: 400,
      body: 'Missing body from request',
    });
  });

  it('should return 400 error response when username is missing from body', async () => {
    const response = await handler({
      ...MOCK_API_GATEWAY_PROXY_EVENT,
      body: JSON.stringify({}),
    });
    expect(response).toStrictEqual({
      statusCode: 400,
      body: 'Missing username from request',
    });
  });
});
