import {handler} from '..';
import {resetActiveCards} from '../../../dao';

jest.mock('../../../dao', () => ({
  resetActiveCards: jest.fn(),
}));

describe('clearActiveCards', () => {
  it('should call resetActiveCards dao function once', async () => {
    await handler();
    expect(resetActiveCards).toHaveBeenCalled();
  });

  it('should return statusCode 200 on a successful run', async () => {
    const {statusCode} = await handler();
    expect(statusCode).toBe(200);
  });

  it('should return 500 error response when resetActiveCards throws an error', async () => {
    jest
      .mocked(resetActiveCards)
      .mockRejectedValue(new Error('Error resetting active cards'));
    const response = await handler();
    expect(response).toStrictEqual({
      statusCode: 500,
      body: 'Something went wrong',
    });
  });
});
