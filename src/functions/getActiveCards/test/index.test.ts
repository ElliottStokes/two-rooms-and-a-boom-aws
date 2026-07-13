import {handler} from '..';
import {getActiveCards} from '../../../dao';
import {DEFAULT_CORS_HEADERS} from '../../constants';

import type {Card} from '../../../types';

jest.mock('../../../dao', () => ({
  getActiveCards: jest.fn(),
}));

const MOCK_ACTIVE_CARD_RESPONSE: {
  basicCards: Card[];
  uniqueCards: Card[];
} = {
  basicCards: [
    {id: '123-abc', title: 'Bomber', teamId: 'r3d'},
    {id: '456-def', title: 'President', teamId: 'b1u3'},
    {id: '789-ghi', title: 'Red Team', teamId: 'r3d'},
    {id: '135-jkl', title: 'Blue Team', teamId: 'b1u3'},
    {id: '246-mno', title: 'Gambler', teamId: 'gr3y'},
  ],
  uniqueCards: [
    {id: '579-pqr', title: 'Thug', teamId: 'r3d'},
    {id: '680-stu', title: 'Thug', teamId: 'b1u3'},
    {id: '159-vwx', title: 'Security', teamId: 'r3d'},
    {id: '248-yza', title: 'Security', teamId: 'b1u3'},
    {id: '367-bcd', title: 'Private Eye', teamId: 'gr3y'},
  ],
};

describe('setActiveCards', () => {
  it('should return active cards on successful run', async () => {
    jest.mocked(getActiveCards).mockResolvedValue(MOCK_ACTIVE_CARD_RESPONSE);
    const {body} = await handler();
    expect(JSON.parse(body)).toStrictEqual(MOCK_ACTIVE_CARD_RESPONSE);
  });

  it('should return statusCode 200 on successful run', async () => {
    const {statusCode} = await handler();
    expect(statusCode).toEqual(200);
  });

  it('should call getActiveCards dao function once', async () => {
    await handler();
    expect(getActiveCards).toHaveBeenCalled();
  });

  it('should return 500 error response when getActiveCards throws an error', async () => {
    jest
      .mocked(getActiveCards)
      .mockRejectedValue(new Error('Error fetching active cards'));
    const response = await handler();
    expect(response).toStrictEqual({
      statusCode: 500,
      headers: {'Content-Type': 'text/plain', ...DEFAULT_CORS_HEADERS},
      body: 'Something went wrong',
    });
  });
});
