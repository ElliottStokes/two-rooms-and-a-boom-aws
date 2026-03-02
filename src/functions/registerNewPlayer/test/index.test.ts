import {randomUUID} from 'crypto';

import {handler} from '..';
import {checkExistingCredentials, createNewPlayer} from '../../../dao';

import type {APIGatewayProxyEvent} from 'aws-lambda';

jest.mock('../../../dao', () => ({
  checkExistingCredentials: jest.fn(),
  createNewPlayer: jest.fn(),
}));

const TEST_USERNAME = 'test-user';

const MOCK_API_GATEWAY_PROXY_EVENT = {
  body: JSON.stringify({username: TEST_USERNAME}),
} as unknown as APIGatewayProxyEvent;

describe('registerNewPlayer', () => {
  describe('when creating a new player', () => {
    const mockUserId = randomUUID();

    beforeEach(() => {
      jest.mocked(checkExistingCredentials).mockResolvedValue(null);
      jest
        .mocked(createNewPlayer)
        .mockResolvedValue({id: mockUserId, username: TEST_USERNAME});
    });

    it('should return status code 201', async () => {
      const {statusCode} = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(statusCode).toStrictEqual(201);
    });

    it('should return user details', async () => {
      const {body} = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(JSON.parse(body)).toStrictEqual({
        id: mockUserId,
        username: TEST_USERNAME,
      });
    });
  });

  describe('when player with username already exists', () => {
    const mockUserId = randomUUID();

    beforeEach(() => {
      jest
        .mocked(checkExistingCredentials)
        .mockResolvedValue({id: mockUserId, username: TEST_USERNAME});
    });

    it('should return status code 409', async () => {
      const {statusCode} = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
      expect(statusCode).toStrictEqual(409);
    });
  });
});
