import { APIGatewayProxyEvent } from 'aws-lambda';

import { handler } from '..'
import { resetActiveCards, setActiveCards } from '../../../dao';

jest.mock('../../../dao', () => ({
  resetActiveCards: jest.fn(),
  setActiveCards: jest.fn(),
}));

const MOCK_API_GATEWAY_PROXY_EVENT = {
  body: JSON.stringify({
    activeCardNames: ['cardOne', 'cardTwo', 'cardThree'],
  }),
} as unknown as APIGatewayProxyEvent;

describe('setActiveCards', () => {
  test('should return statusCode 204 on successful run', async () => {
    const { statusCode } = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
    expect(statusCode).toEqual(204);
  });

  test('should call resetActiveCards dao function once', async () => {
    await handler(MOCK_API_GATEWAY_PROXY_EVENT);
    expect(resetActiveCards).toHaveBeenCalled();
  });

  test('should call setActiveCards dao function with activeCardNames list', async () => {
    await handler(MOCK_API_GATEWAY_PROXY_EVENT);
    expect(setActiveCards).toHaveBeenCalledWith(['cardOne', 'cardTwo', 'cardThree']);
  });

  test('should return 400 error response when request is missing body', async () => {
    const response = await handler({} as unknown as APIGatewayProxyEvent);
    expect(response).toStrictEqual({
      statusCode: 400,
      body: 'Missing body from request',
    });
  });

  test('should return 400 error response when activeCardNames missing from body', async () => {
    const response = await handler({
      ...MOCK_API_GATEWAY_PROXY_EVENT,
      body: JSON.stringify({}),
    });
    expect(response).toStrictEqual({
      statusCode: 400,
      body: 'missing activeCardNames from request body',
    });
  });

  test('should return 500 error response when resetActiveCards throws an error', async () => {
    jest.mocked(resetActiveCards).mockRejectedValue(new Error('Error reseting active cards'));
    const response = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
    expect(response).toStrictEqual({
      statusCode: 500,
      body: 'Something went wrong',
    })
  });

  test('should return 500 error response when setActiveCards throws an error', async () => {
    jest.mocked(setActiveCards).mockRejectedValue(new Error('Error setting active cards'));
    const response = await handler(MOCK_API_GATEWAY_PROXY_EVENT);
    expect(response).toStrictEqual({
      statusCode: 500,
      body: 'Something went wrong',
    });
  });
});