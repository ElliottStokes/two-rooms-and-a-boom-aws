import {getClient} from '../../client';
import {setCardUrl} from '../setCardUrl';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_CARD_ID = '123-abc';
const MOCK_URL = 'www.traab.com/active-card.png';
const MOCK_EXPIRY = new Date(Date.now() + 3600000);

describe('setCardUrl', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({});
  });

  it('should call getClient function', async () => {
    await setCardUrl(MOCK_CARD_ID, MOCK_URL, MOCK_EXPIRY);
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with SELECT query', async () => {
    await setCardUrl(MOCK_CARD_ID, MOCK_URL, MOCK_EXPIRY);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'UPDATE two_rooms_and_a_boom.card SET url = $2, urlexpiry = $3 WHERE cardid = $1;',
      [MOCK_CARD_ID, MOCK_URL, MOCK_EXPIRY],
    );
  });
});
