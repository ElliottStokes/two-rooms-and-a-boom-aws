import {handler} from '..';
import {getCardUrl, setCardUrl} from '../../../dao';
import {createPresignedUrl} from '../createPresignedUrl';

import type {APIGatewayProxyEvent} from 'aws-lambda';

jest.mock('../../../dao', () => ({
  getCardUrl: jest.fn(),
  setCardUrl: jest.fn(),
}));

jest.mock('../createPresignedUrl', () => ({
  createPresignedUrl: jest.fn(),
}));

const DATE_PLUS_ONE_HOUR = new Date(Date.now() + 3600000);
const DATE_MINUS_ONE_HOUR = new Date(Date.now() - 3600000);
const MOCK_ACTIVE_CARD = {
  url: 'www.traab.com/active-card.png',
  expiry: DATE_PLUS_ONE_HOUR,
  colour: 'blue',
  filename: 'active-card.png',
};
const MOCK_EXPIRED_CARD = {
  url: 'www.traab.com/expired-card.png',
  expiry: DATE_MINUS_ONE_HOUR,
  colour: 'blue',
  filename: 'active-card.png',
};
const MOCK_MISSING_CARD = {
  url: null,
  expiry: null,
  colour: 'blue',
  filename: 'missing-card.png',
};
const MOCK_CARD_ID = '123-card-abc';
const MOCK_REQUEST_EVENT: APIGatewayProxyEvent = {
  pathParameters: {cardId: MOCK_CARD_ID},
} as unknown as APIGatewayProxyEvent;
const MOCK_PRESIGNED_URL = {
  presignedUrl: '',
  newExpiry: new Date(Date.now() + 3600000),
};

describe('getCard', () => {
  describe('when there is a an active card url', () => {
    beforeEach(() => {
      jest.mocked(getCardUrl).mockResolvedValue(MOCK_ACTIVE_CARD);
    });

    it('should call getCardUrl dao function once', async () => {
      await handler(MOCK_REQUEST_EVENT);
      expect(getCardUrl).toHaveBeenCalledWith(MOCK_CARD_ID);
    });

    it('should return card image url on a successful run', async () => {
      const {body} = await handler(MOCK_REQUEST_EVENT);
      expect(body).toStrictEqual(JSON.stringify({url: MOCK_ACTIVE_CARD.url}));
    });

    it('should return statusCode 200 on a successful run', async () => {
      const {statusCode} = await handler(MOCK_REQUEST_EVENT);
      expect(statusCode).toBe(200);
    });
  });

  describe('when there is an expired card url', () => {
    beforeEach(() => {
      jest.mocked(getCardUrl).mockResolvedValue(MOCK_EXPIRED_CARD);
      jest.mocked(createPresignedUrl).mockResolvedValue(MOCK_PRESIGNED_URL);
    });

    it('should call getCardUrl dao function once', async () => {
      await handler(MOCK_REQUEST_EVENT);
      expect(getCardUrl).toHaveBeenCalledWith(MOCK_CARD_ID);
    });

    it('should call createPresignedUrl function once', async () => {
      await handler(MOCK_REQUEST_EVENT);
      expect(createPresignedUrl).toHaveBeenCalledWith(
        MOCK_EXPIRED_CARD.filename,
        MOCK_EXPIRED_CARD.colour,
      );
    });

    it('should call setCardUrl dao function once', async () => {
      await handler(MOCK_REQUEST_EVENT);
      expect(setCardUrl).toHaveBeenCalledWith(
        MOCK_CARD_ID,
        MOCK_PRESIGNED_URL.presignedUrl,
        MOCK_PRESIGNED_URL.newExpiry,
      );
    });

    it('should return new presigned URL in response body', async () => {
      const {body} = await handler(MOCK_REQUEST_EVENT);
      expect(body).toStrictEqual(
        JSON.stringify({url: MOCK_PRESIGNED_URL.presignedUrl}),
      );
    });

    it('should return statusCode 200 in reponse', async () => {
      const {statusCode} = await handler(MOCK_REQUEST_EVENT);
      expect(statusCode).toEqual(200);
    });
  });

  describe('when there is an no card url', () => {
    beforeEach(() => {
      jest.mocked(getCardUrl).mockResolvedValue(MOCK_MISSING_CARD);
      jest.mocked(createPresignedUrl).mockResolvedValue(MOCK_PRESIGNED_URL);
    });

    it('should call getCardUrl dao function once', async () => {
      await handler(MOCK_REQUEST_EVENT);
      expect(getCardUrl).toHaveBeenCalledWith(MOCK_CARD_ID);
    });

    it('should call createPresignedUrl function once', async () => {
      await handler(MOCK_REQUEST_EVENT);
      expect(createPresignedUrl).toHaveBeenCalledWith(
        MOCK_MISSING_CARD.filename,
        MOCK_MISSING_CARD.colour,
      );
    });

    it('should call setCardUrl dao function once', async () => {
      await handler(MOCK_REQUEST_EVENT);
      expect(setCardUrl).toHaveBeenCalledWith(
        MOCK_CARD_ID,
        MOCK_PRESIGNED_URL.presignedUrl,
        MOCK_PRESIGNED_URL.newExpiry,
      );
    });

    it('should return new presigned URL in response body', async () => {
      const {body} = await handler(MOCK_REQUEST_EVENT);
      expect(body).toStrictEqual(
        JSON.stringify({url: MOCK_PRESIGNED_URL.presignedUrl}),
      );
    });

    it('should return statusCode 200 in reponse', async () => {
      const {statusCode} = await handler(MOCK_REQUEST_EVENT);
      expect(statusCode).toEqual(200);
    });
  });
});
