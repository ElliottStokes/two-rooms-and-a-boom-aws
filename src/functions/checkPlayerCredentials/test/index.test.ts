import {handler} from '..';
import {checkExistingCredentials} from '../../../dao';

import type {APIGatewayProxyEvent} from 'aws-lambda';

jest.mock('../../../dao', () => ({
  checkExistingCredentials: jest.fn(),
}));

const TEST_USERNAME = 'test-user';
const MOCK_USER_ID = '123-abc';
const MOCK_API_GATEWAY_PROXY_EVENT = {
  body: JSON.stringify({username: TEST_USERNAME}),
} as unknown as APIGatewayProxyEvent;

describe('checkPlayerCredentials', () => {
  beforeEach(() => {
    jest
      .mocked(checkExistingCredentials)
      .mockResolvedValue({id: MOCK_USER_ID, username: TEST_USERNAME});
  });

  it('should return status code 200', async () => {
    const {statusCode} = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
    expect(statusCode).toStrictEqual(200);
  });

  it('should return existing user details', async () => {
    const {body} = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
    expect(JSON.parse(body)).toStrictEqual({
      id: MOCK_USER_ID,
      username: TEST_USERNAME,
    });
  });

  it('should return status code 404 if player does not exist', async () => {
    jest.mocked(checkExistingCredentials).mockResolvedValue(null);
    const {statusCode} = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
    expect(statusCode).toStrictEqual(404);
  });
});
