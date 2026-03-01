import {getClient} from '../../client';
import {getCardUrl} from '../getCardUrl';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_CARD_ID = '123-abc';

describe('getCardUrl', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({});
  });

  it('should call getClient function', async () => {
    await getCardUrl(MOCK_CARD_ID);
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with SELECT query', async () => {
    await getCardUrl(MOCK_CARD_ID);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'SELECT c.url, c.urlexpiry, c.filename, t.colour ' +
        'FROM two_rooms_and_a_boom.card c ' +
        'LEFT JOIN two_rooms_and_a_boom.team t ON c.teamid = t.teamid ' +
        'WHERE c.cardid = $1',
      [MOCK_CARD_ID],
    );
  });
});
